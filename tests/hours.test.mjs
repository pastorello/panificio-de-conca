// Opening-hours logic (src/lib/hours.ts): states of OpenNow in Europe/Rome, texts in three languages.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import {
  describeSpecial,
  describeState,
  openState,
  romeTime,
  specialVisible,
  summarizeWeek,
} from '../src/lib/hours.ts';

const business = JSON.parse(await readFile('src/content/business.json', 'utf8'));
const strings = Object.fromEntries(
  await Promise.all(
    ['it', 'en', 'de'].map(async (lang) => [
      lang,
      JSON.parse(await readFile(`src/content/site/${lang}.json`, 'utf8')).hours,
    ]),
  ),
);
const weekly = business.hours.weekly;
/** Drops the word joiners around the dashes (see DASH in hours.ts). */
const plain = (value) => value.replaceAll('\u2060', '');

/** Sentence shown by OpenNow at a Rome wall-clock time, e.g. "2026-10-12T10:00" (CEST, UTC+2). */
function text(local, { lang = 'it', specials = [], offset = '+02:00' } = {}) {
  const state = openState(romeTime(new Date(`${local}:00${offset}`)), weekly, specials);
  const { lead, rest, chip, pending } = describeState(state, strings[lang], lang);
  return plain([chip && `[${chip}]`, lead, pending ?? rest.trim()].filter(Boolean).join(' '));
}

describe('OpenNow in Europe/Rome', () => {
  it('open during a range (state 1)', () => {
    assert.equal(text('2026-10-12T10:00'), 'Aperto oggi 7:30–13:15 e 16:30–20:00');
    assert.equal(text('2026-10-15T18:00'), 'Aperto oggi 7:30–13:15 e 17:00–20:00');
  });
  it('closed now, opens later today (state 2)', () => {
    assert.equal(text('2026-10-12T14:00'), 'Chiuso ora · riapre oggi alle 16:30');
    assert.equal(text('2026-10-12T06:00'), 'Chiuso ora · riapre oggi alle 7:30');
    assert.equal(text('2026-10-15T16:45'), 'Chiuso ora · riapre oggi alle 17:00');
    assert.equal(
      text('2026-10-12T13:15'),
      'Chiuso ora · riapre oggi alle 16:30',
      'closing time is exclusive',
    );
  });
  it('closed for the day (state 3)', () => {
    assert.equal(text('2026-10-12T20:00'), 'Oggi chiuso · riapre domani alle 7:30');
    assert.equal(text('2026-10-18T10:00'), 'Oggi chiuso · riapre domani alle 7:30', 'Sunday');
    assert.equal(
      text('2026-10-17T21:00'),
      'Oggi chiuso · riapre lunedì alle 7:30',
      'Saturday night',
    );
  });
  it('uses the Rome calendar, not the visitor’s', () => {
    // 22:30 UTC on Monday is 00:30 on Tuesday in Rome.
    const rome = romeTime(new Date('2026-10-12T22:30:00Z'));
    assert.deepEqual(rome, { date: '2026-10-13', day: 'tue', minutes: 30 });
    // In winter Rome is UTC+1: 06:45 UTC is 7:45, open.
    assert.equal(
      text('2026-12-01T07:45', { offset: '+01:00' }),
      'Aperto oggi 7:30–13:15 e 16:30–20:00',
    );
    // Daylight saving starts on 29 March 2026: 01:30 UTC is 03:30 CEST.
    assert.equal(romeTime(new Date('2026-03-29T01:30:00Z')).minutes, 3 * 60 + 30);
  });
  it('speaks English and German', () => {
    assert.equal(text('2026-10-12T10:00', { lang: 'en' }), 'Open today 7:30–13:15 and 16:30–20:00');
    assert.equal(text('2026-10-12T14:00', { lang: 'en' }), 'Closed now · opens today at 16:30');
    assert.equal(text('2026-10-17T21:00', { lang: 'en' }), 'Closed today · opens Monday at 7:30');
    assert.equal(
      text('2026-10-12T10:00', { lang: 'de' }),
      'Heute geöffnet 7:30–13:15 und 16:30–20:00',
    );
    assert.equal(
      text('2026-10-12T14:00', { lang: 'de' }),
      'Jetzt geschlossen · öffnet heute um 16:30 Uhr',
    );
    assert.equal(
      text('2026-10-18T10:00', { lang: 'de' }),
      'Heute geschlossen · öffnet morgen um 7:30 Uhr',
    );
  });
});

describe('holiday hours (state 4)', () => {
  const luminarie = business.hours.special[0];
  const sundays = {
    id: 'test',
    from: '2026-11-09',
    to: '2027-01-11',
    weekly: { sun: [['08:00', '13:00']] },
    dates: { '2026-12-25': [] },
  };
  it('shows the chip and the placeholder while the hours are pending', () => {
    assert.equal(
      text('2026-11-15T10:00', { specials: [luminarie], offset: '+01:00' }),
      `[Orari delle feste] ${luminarie.pending}`,
    );
  });
  it('special hours win over the week', () => {
    assert.equal(
      text('2026-11-15T10:00', { specials: [sundays], offset: '+01:00' }),
      '[Orari delle feste] Aperto oggi 8:00–13:00',
    );
    assert.equal(
      text('2026-12-25T10:00', { specials: [sundays], offset: '+01:00' }),
      '[Orari delle feste] Oggi chiuso · riapre domani alle 7:30',
    );
    assert.equal(
      text('2026-11-14T21:00', { specials: [sundays], offset: '+01:00' }),
      'Oggi chiuso · riapre domani alle 8:00',
      'Saturday night before a special Sunday',
    );
    assert.equal(
      text('2026-11-16T10:00', { specials: [sundays], offset: '+01:00' }),
      'Aperto oggi 7:30–13:15 e 16:30–20:00',
      'weekdays keep the usual hours, without chip',
    );
  });
  it('appears 30 days ahead and disappears after the last day', () => {
    assert.equal(specialVisible(luminarie, '2026-10-13'), true);
    assert.equal(specialVisible(luminarie, '2026-10-09'), false);
    assert.equal(specialVisible(luminarie, '2027-01-11'), true);
    assert.equal(specialVisible(luminarie, '2027-01-12'), false);
  });
  it('describes the hours of the period', () => {
    assert.equal(describeSpecial(luminarie, strings.it, 'it'), luminarie.pending);
    assert.equal(
      plain(describeSpecial(sundays, strings.it, 'it')),
      'domenica 8:00–13:00; 25 dicembre chiuso',
    );
    assert.equal(
      plain(describeSpecial(sundays, strings.de, 'de')),
      'Sonntag 8:00–13:00; 25. Dezember geschlossen',
    );
  });
});

describe('static week without JavaScript (state 5)', () => {
  it('summarizes the week from business.json', () => {
    const week = summarizeWeek(weekly, 'it', strings.it.closed_sunday);
    assert.deepEqual(JSON.parse(plain(JSON.stringify(week))), {
      lead: 'Lunedì–sabato',
      ranges: '7:30–13:15 e 16:30–20:00',
      exceptions: ['giovedì 7:30–13:15 e 17:00–20:00'],
      closed: 'Domenica chiuso',
    });
    assert.equal(
      plain(summarizeWeek(weekly, 'en', strings.en.closed_sunday).lead),
      'Monday–Saturday',
    );
    assert.equal(
      plain(summarizeWeek(weekly, 'de', strings.de.closed_sunday).lead),
      'Montag–Samstag',
    );
    assert.match(week.ranges, /7:30\u2060–\u206013:15/, 'no line break inside a range');
  });
});
