import { calendarDayIndex } from './calendar-day.js';

export interface DailyStreakState {
  readonly lastDay: string;
  readonly count: number;
  readonly best: number;
}

export interface DailyStreakView {
  readonly count: number;
  readonly best: number;
  readonly completedToday: boolean;
  readonly nextCount: number;
  readonly clockBeforeRecordedDay: boolean;
}

function validate(state: DailyStreakState | null): void {
  if (state === null) return;
  calendarDayIndex(state.lastDay);
  if (!Number.isSafeInteger(state.count) || state.count < 1 ||
      !Number.isSafeInteger(state.best) || state.best < state.count) {
    throw new RangeError('Invalid daily streak state');
  }
}

function increment(count: number): number {
  if (!Number.isSafeInteger(count + 1)) throw new RangeError('Daily streak count overflow');
  return count + 1;
}

/** Read-only projection; viewing a missed day never rewrites durable history. */
export function getDailyStreak(state: DailyStreakState | null, today: string): DailyStreakView {
  validate(state);
  const now = calendarDayIndex(today);
  const delta = state === null ? Infinity : now - calendarDayIndex(state.lastDay);
  const completedToday = delta === 0;
  const count = state !== null && delta >= 0 && delta <= 1 ? state.count : 0;
  return {
    count,
    best: state?.best ?? 0,
    completedToday,
    nextCount: completedToday ? count : increment(count),
    clockBeforeRecordedDay: delta < 0,
  };
}

/** Call only for a verified solved task. Persist state and any bonus together. */
export function recordDailyStreak(
  state: DailyStreakState | null,
  taskDay: string,
  today: string,
): { readonly state: DailyStreakState | null; readonly recorded: boolean } {
  validate(state);
  calendarDayIndex(taskDay);
  const now = calendarDayIndex(today);
  if (taskDay !== today || (state !== null && today <= state.lastDay)) {
    return { state, recorded: false };
  }
  const count = state !== null && now - calendarDayIndex(state.lastDay) === 1
    ? increment(state.count) : 1;
  return { state: { lastDay: today, count, best: Math.max(state?.best ?? 0, count) }, recorded: true };
}
