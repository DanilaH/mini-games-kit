import { describe, expect, it } from 'vitest';
import { calendarDayIndex, getDailyStreak, isCalendarDay, localCalendarDay, recordDailyStreak } from '../src/core/index';
import type { DailyStreakState } from '../src/core/index';

describe('calendar day identity', () => {
  it.each(['2026-00-10', '2026-13-01', '2026-02-29', '2100-02-29', '2025-04-31', '2026-01-00', '0000-01-01', '2026-1-01', '2026-01-01x', '10000-01-01', '2026-01-01\n'])('rejects impossible or noncanonical day %s', day => {
    expect(isCalendarDay(day)).toBe(false);
    expect(() => calendarDayIndex(day)).toThrow(RangeError);
  });
  it('handles Gregorian century rules and four-digit early years', () => {
    expect(isCalendarDay('2400-02-29')).toBe(true);
    expect(isCalendarDay('0001-01-01')).toBe(true);
    expect(calendarDayIndex('0100-01-01') - calendarDayIndex('0099-12-31')).toBe(1);
    expect(isCalendarDay(undefined)).toBe(false);
    expect(isCalendarDay(20261109)).toBe(false);
  });
  it('formats the chosen device-local calendar and rejects invalid dates', () => {
    const date = new Date(2026, 10, 9, 0, 1);
    expect(localCalendarDay(date)).toBe('2026-11-09');
    expect(() => localCalendarDay(new Date(NaN))).toThrow(RangeError);
    const early = new Date(); early.setFullYear(1, 0, 1);
    expect(localCalendarDay(early)).toBe('0001-01-01');
    early.setFullYear(10000);
    expect(() => localCalendarDay(early)).toThrow(RangeError);
  });
});

describe('daily streak without reward policy', () => {
  it('records once across serialization and never mutates its input', () => {
    const first = recordDailyStreak(null, '2026-11-09', '2026-11-09');
    expect(first).toEqual({ recorded: true, state: { lastDay: '2026-11-09', count: 1, best: 1 } });
    const restored = Object.freeze(JSON.parse(JSON.stringify(first.state)) as DailyStreakState);
    const repeat = recordDailyStreak(restored, '2026-11-09', '2026-11-09');
    expect(repeat.recorded).toBe(false);
    expect(repeat.state).toBe(restored);
    expect(getDailyStreak(restored, '2026-11-09')).toMatchObject({ count: 1, completedToday: true, nextCount: 1 });
  });
  it.each([
    ['2026-12-31', '2027-01-01'],
    ['2028-02-28', '2028-02-29', '2028-03-01'],
    ['2100-02-28', '2100-03-01'],
    ['2400-02-28', '2400-02-29', '2400-03-01'],
  ])('counts calendar boundaries %j', (...days) => {
    let state: DailyStreakState | null = null;
    for (const day of days) state = recordDailyStreak(state, day, day).state;
    expect(state?.count).toBe(days.length);
  });
  it('keeps yesterday alive, expires after a missed day and retains best', () => {
    const state = { lastDay: '2026-11-09', count: 6, best: 12 };
    expect(getDailyStreak(state, '2026-11-10')).toMatchObject({ count: 6, nextCount: 7, completedToday: false });
    expect(getDailyStreak(state, '2026-11-11')).toMatchObject({ count: 0, best: 12, nextCount: 1 });
    expect(recordDailyStreak(state, '2026-11-11', '2026-11-11').state).toEqual({ lastDay: '2026-11-11', count: 1, best: 12 });
    expect(state.count).toBe(6);
  });
  it('archive, future task and clock rollback cannot advance the streak', () => {
    const state = { lastDay: '2026-11-09', count: 6, best: 6 };
    for (const [task, today] of [['2026-11-08', '2026-11-10'], ['2026-11-11', '2026-11-10'], ['2026-11-08', '2026-11-08']]) {
      expect(recordDailyStreak(state, task!, today!)).toEqual({ state, recorded: false });
    }
    expect(getDailyStreak(state, '2026-11-08')).toMatchObject({ count: 0, best: 6, clockBeforeRecordedDay: true });
    expect(getDailyStreak(null, '2026-11-08')).toMatchObject({ nextCount: 1, best: 0 });
  });
  it('rejects corrupt state and counter overflow', () => {
    for (const state of [
      { lastDay: '2026-13-01', count: 1, best: 1 },
      { lastDay: '2026-11-09', count: 1.5, best: 2 },
      { lastDay: '2026-11-09', count: 2, best: 1 },
    ]) expect(() => recordDailyStreak(state, '2026-11-10', '2026-11-10')).toThrow(RangeError);
    expect(() => recordDailyStreak({ lastDay: '2026-11-09', count: Number.MAX_SAFE_INTEGER, best: Number.MAX_SAFE_INTEGER }, '2026-11-10', '2026-11-10')).toThrow(/overflow/);
  });
});
