// Opening hours shared by OpenNow, HoursTable, VisitBlock and the JSON-LD.
// Pure functions with no Astro imports: the client scripts bundle this same file, so the page
// computes "open now" in the browser exactly as the build does, always in Europe/Rome.

export const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type Weekday = (typeof weekdays)[number];
export type Range = [string, string];
export type Weekly = Record<Weekday, Range[]>;

/** A period with holiday hours (business.json → hours.special). Special hours win over weekly ones. */
export interface Special {
  id: string;
  /** First and last day, inclusive, YYYY-MM-DD in Europe/Rome. */
  from: string;
  to: string;
  /** Hours by weekday inside the period, e.g. Sundays open during the Luminarie. */
  weekly?: Partial<Weekly>;
  /** Hours on single dates inside the period; [] means closed. */
  dates?: Record<string, Range[]>;
  /** "[[…]]" while the owner has not confirmed the hours of the period. */
  pending?: string;
}

/** Strings of site/*.json used to describe the hours. */
export interface HoursStrings {
  open_today: string;
  closed_today: string;
  closed_now: string;
  closed_sunday: string;
  next_today: string;
  next_tomorrow: string;
  next_day: string;
  closed: string;
  special: string;
}

export const TIME_ZONE = 'Europe/Rome';
/** Holiday hours appear above the table this many days before they start. */
export const SPECIAL_NOTICE_DAYS = 30;

/** BCP 47 tags for Intl: British English for dates and lists, as the site's English. */
export function intlLocale(locale: string): string {
  return ({ it: 'it-IT', en: 'en-GB', de: 'de-DE' } as Record<string, string>)[locale] ?? locale;
}

/**
 * En dash that never ends a line: U+2060 WORD JOINER on both sides keeps «16:30–20:00» and
 * «Lunedì–sabato» whole, so a narrow column breaks between ranges, not inside one.
 */
export const DASH = '\u2060–\u2060';

/** "07:30" → "7:30": 24-hour clock, no leading zero (DESIGN.md §7, decision 11). */
export function formatTime(time: string): string {
  return time.replace(/^0(\d)/, '$1');
}

const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

/** "7:30–13:15 e 16:30–20:00", with the conjunction of the locale. */
export function formatRanges(ranges: Range[], locale: string): string {
  const parts = ranges.map(([from, to]) => `${formatTime(from)}${DASH}${formatTime(to)}`);
  return new Intl.ListFormat(intlLocale(locale), { style: 'long', type: 'conjunction' }).format(
    parts,
  );
}

/** "7:30–13:15 · 16:30–20:00", as in the hours table. */
export function formatRangesTable(ranges: Range[]): string {
  return ranges.map(([from, to]) => `${formatTime(from)}${DASH}${formatTime(to)}`).join(' · ');
}

/** Weekday name in the locale; 2024-01-01 was a Monday. */
export function weekdayName(day: Weekday, locale: string): string {
  const date = new Date(Date.UTC(2024, 0, 1 + weekdays.indexOf(day)));
  return new Intl.DateTimeFormat(intlLocale(locale), { weekday: 'long', timeZone: 'UTC' }).format(
    date,
  );
}

export function capitalize(value: string, locale: string): string {
  return value.charAt(0).toLocaleUpperCase(intlLocale(locale)) + value.slice(1);
}

/** "9 novembre – 11 gennaio": day and month of each end, without the year. */
export function formatPeriod(from: string, to: string, locale: string): string {
  const format = new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
  const day = (date: string) => format.format(new Date(`${date}T00:00:00Z`));
  return from === to ? day(from) : `${day(from)} – ${day(to)}`;
}

/** Replaces {name} with the given values. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);
}

/* ---------- Dates in Europe/Rome ---------- */

export interface RomeTime {
  /** YYYY-MM-DD */
  date: string;
  day: Weekday;
  /** Minutes since midnight. */
  minutes: number;
}

/** The calendar date, weekday and time of an instant in Europe/Rome. */
export function romeTime(instant: Date): RomeTime {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return { date, day: weekdayOf(date), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function weekdayOf(date: string): Weekday {
  const index = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
  return weekdays[index];
}

export function addDays(date: string, days: number): string {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

/* ---------- Hours of a given day ---------- */

export interface DayHours {
  /** null when the hours of a special period are not known yet. */
  ranges: Range[] | null;
  /** The special period these hours come from, if any. */
  special?: Special;
}

export function specialOn(specials: Special[], date: string): Special | undefined {
  return specials.find((special) => special.from <= date && date <= special.to);
}

/** Hours of a date: a special date, then a special weekday, then the usual week. */
export function hoursOn(date: string, weekly: Weekly, specials: Special[]): DayHours {
  const special = specialOn(specials, date);
  if (special) {
    const byDate = special.dates?.[date];
    if (byDate) return { ranges: byDate, special };
    const byDay = special.weekly?.[weekdayOf(date)];
    if (byDay) return { ranges: byDay, special };
    if (special.pending) return { ranges: null, special };
  }
  return { ranges: weekly[weekdayOf(date)] };
}

/* ---------- Open now ---------- */

export interface NextOpening {
  when: 'today' | 'tomorrow' | 'later';
  day: Weekday;
  time: string;
}

export type OpenState =
  | { kind: 'open'; ranges: Range[]; special?: Special }
  | { kind: 'later'; next: NextOpening; special?: Special }
  | { kind: 'closed'; next: NextOpening | null; special?: Special }
  | { kind: 'unknown'; special: Special };

function nextOpening(now: RomeTime, weekly: Weekly, specials: Special[]): NextOpening | null {
  for (let offset = 1; offset <= 14; offset++) {
    const date = addDays(now.date, offset);
    const { ranges } = hoursOn(date, weekly, specials);
    if (ranges === null) return null;
    if (ranges.length) {
      return {
        when: offset === 1 ? 'tomorrow' : 'later',
        day: weekdayOf(date),
        time: ranges[0][0],
      };
    }
  }
  return null;
}

/**
 * The five states of DESIGN.md §6.5 minus the static one: open now (1), closed now but opening
 * later today (2), closed for the rest of the day (3); a special period adds the chip (4).
 */
export function openState(now: RomeTime, weekly: Weekly, specials: Special[]): OpenState {
  const { ranges, special } = hoursOn(now.date, weekly, specials);
  if (ranges === null) return { kind: 'unknown', special: special! };
  if (ranges.some(([from, to]) => toMinutes(from) <= now.minutes && now.minutes < toMinutes(to))) {
    return { kind: 'open', ranges, special };
  }
  const later = ranges.find(([from]) => toMinutes(from) > now.minutes);
  if (later)
    return { kind: 'later', next: { when: 'today', day: now.day, time: later[0] }, special };
  return { kind: 'closed', next: nextOpening(now, weekly, specials), special };
}

export interface StateText {
  /** Bold first words: «Aperto oggi», «Chiuso ora», «Oggi chiuso». */
  lead: string;
  /** The rest of the sentence, starting with a space or " · ". */
  rest: string;
  /** A [[placeholder]] to show instead of the rest (hours of a special period not known yet). */
  pending?: string;
  /** «Orari delle feste» when today's hours come from a special period. */
  chip?: string;
}

/** Splits «Oggi chiuso · riapre {next}» into the bold lead and the rest, then fills the rest. */
function sentence(template: string, vars: Record<string, string>): { lead: string; rest: string } {
  const dot = template.indexOf(' · ');
  const brace = template.indexOf('{');
  const cut = dot >= 0 ? dot : brace >= 0 ? brace : template.length;
  const lead = template.slice(0, cut).trim();
  const rest = fill(template.slice(cut), vars);
  return { lead, rest: rest.startsWith(' ') ? rest : ` ${rest}` };
}

function nextText(next: NextOpening, t: HoursStrings, locale: string): string {
  const time = formatTime(next.time);
  if (next.when === 'today') return fill(t.next_today, { time });
  if (next.when === 'tomorrow') return fill(t.next_tomorrow, { time });
  return fill(t.next_day, { day: weekdayName(next.day, locale), time });
}

export function describeState(state: OpenState, t: HoursStrings, locale: string): StateText {
  const chip = state.special ? t.special : undefined;
  switch (state.kind) {
    case 'open':
      return { ...sentence(t.open_today, { ranges: formatRanges(state.ranges, locale) }), chip };
    case 'later':
      return { ...sentence(t.closed_now, { next: nextText(state.next, t, locale) }), chip };
    case 'closed':
      if (!state.next) return { lead: sentence(t.closed_today, {}).lead, rest: '', chip };
      return { ...sentence(t.closed_today, { next: nextText(state.next, t, locale) }), chip };
    case 'unknown':
      return { lead: '', rest: '', pending: state.special.pending, chip };
  }
}

/* ---------- Static texts ---------- */

export interface WeekSummary {
  /** Run of open days with the usual hours, e.g. "Lunedì–sabato". */
  lead: string;
  /** Usual hours of that run. */
  ranges: string;
  /** Days in the run with different hours, e.g. "giovedì 7:30–13:15 e 17:00–20:00". */
  exceptions: string[];
  /** Closed days, already a sentence from site/*.json (hours.closed_sunday). */
  closed: string;
}

/**
 * The static week shown without JavaScript (DESIGN.md §6.5, state 5).
 * Only Sunday closures have a string in the brief (hours.closed_sunday): any other
 * closed day fails the build so that a string gets added rather than invented here.
 */
export function summarizeWeek(weekly: Weekly, locale: string, closedSunday: string): WeekSummary {
  const open = weekdays.filter((day) => weekly[day].length > 0);
  const closedDays = weekdays.filter((day) => weekly[day].length === 0);
  if (closedDays.length !== 1 || closedDays[0] !== 'sun') {
    throw new Error(`hours: closed days ${closedDays.join(', ')} need a string in site/*.json`);
  }
  const counts = new Map<string, number>();
  for (const day of open) {
    const key = JSON.stringify(weekly[day]);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const usualKey = [...counts].sort((a, b) => b[1] - a[1])[0][0];
  const usual = JSON.parse(usualKey) as Range[];
  const first = weekdayName(open[0], locale);
  const last = weekdayName(open[open.length - 1], locale);
  return {
    lead: capitalize(open.length > 1 ? `${first}${DASH}${last}` : first, locale),
    ranges: formatRanges(usual, locale),
    exceptions: open
      .filter((day) => JSON.stringify(weekly[day]) !== usualKey)
      .map((day) => `${weekdayName(day, locale)} ${formatRanges(weekly[day], locale)}`),
    closed: closedSunday,
  };
}

/** Whether the holiday block shows on a given date: from SPECIAL_NOTICE_DAYS before until the end. */
export function specialVisible(special: Special, date: string): boolean {
  return date <= special.to && daysBetween(date, special.from) <= SPECIAL_NOTICE_DAYS;
}

/**
 * The hours of a special period as text, without the dates: «domenica 9:00–13:00; 25 dicembre
 * chiuso», or its [[placeholder]] while the owner has not confirmed them.
 */
export function describeSpecial(special: Special, t: HoursStrings, locale: string): string {
  if (special.pending) return special.pending;
  const parts: string[] = [];
  for (const day of weekdays) {
    const ranges = special.weekly?.[day];
    if (ranges) {
      parts.push(
        `${weekdayName(day, locale)} ${ranges.length ? formatRanges(ranges, locale) : t.closed.toLocaleLowerCase(intlLocale(locale))}`,
      );
    }
  }
  for (const [date, ranges] of Object.entries(special.dates ?? {}).sort()) {
    const label = formatPeriod(date, date, locale);
    parts.push(
      `${label} ${ranges.length ? formatRanges(ranges, locale) : t.closed.toLocaleLowerCase(intlLocale(locale))}`,
    );
  }
  return parts.join('; ');
}
