import { creditHints, recordDailyStreak } from '../src/core/index.js';
import type { DailyStreakState, HintBudget } from '../src/core/index.js';

export interface DailyProgressExample {
  readonly completedDays: readonly string[];
  readonly streak: DailyStreakState | null;
  readonly hints: HintBudget;
}

/** Pure example only. The consumer validates task availability/solution and commits the whole returned snapshot. */
export function planDailyCompletion(
  previous: DailyProgressExample,
  taskDay: string,
  today: string,
  bonusAt: (streakCount: number) => number,
): DailyProgressExample {
  const update = recordDailyStreak(previous.streak, taskDay, today);
  if (taskDay > today) throw new RangeError('A future task is not available');
  if (previous.completedDays.includes(taskDay)) return previous;
  const reward = update.recorded ? bonusAt(update.state!.count) : 0;
  return {
    completedDays: [...previous.completedDays, taskDay],
    streak: update.state,
    hints: creditHints(previous.hints, reward),
  };
}
