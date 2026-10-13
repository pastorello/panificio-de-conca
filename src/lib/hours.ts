// Opening-hours formatting shared by OpenNow, HoursTable and VisitBlock.
// Pure functions: safe to import from client scripts too.

export const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type Weekday = (typeof weekdays)[number];
export type Range = [string, string];
export type Weekly = Record<Weekday, Range[]>;

/** "07:30" → "7:30": 24-hour clock, no leading zero (DESIGN.md §7, decision 11). */
export function formatTime(time: string): string {
  return time.replace(/^0(\d)/, '$1');
}

/** "7:30–13:15 e 16:30–20:00", with the conjunction of the locale. */
export function formatRanges(ranges: Range[], locale: string): string {
  const parts = ranges.map(([from, to]) => `${formatTime(from)}–${formatTime(to)}`);
  return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(parts);
}

/** Weekday name in the locale; 2024-01-01 was a Monday. */
export function weekdayName(day: Weekday, locale: string): string {
  const date = new Date(Date.UTC(2024, 0, 1 + weekdays.indexOf(day)));
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(date);
}

export function capitalize(value: string, locale: string): string {
  return value.charAt(0).toLocaleUpperCase(locale) + value.slice(1);
}

const sameRanges = (a: Range[], b: Range[]) => JSON.stringify(a) === JSON.stringify(b);

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
 * The static week used by OpenNow without JavaScript (DESIGN.md §6.5, state 5).
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
  const usual = JSON.parse([...counts].sort((a, b) => b[1] - a[1])[0][0]) as Range[];
  const first = weekdayName(open[0], locale);
  const last = weekdayName(open[open.length - 1], locale);
  return {
    lead: capitalize(open.length > 1 ? `${first}–${last}` : first, locale),
    ranges: formatRanges(usual, locale),
    exceptions: open
      .filter((day) => !sameRanges(weekly[day], usual))
      .map((day) => `${weekdayName(day, locale)} ${formatRanges(weekly[day], locale)}`),
    closed: closedSunday,
  };
}
