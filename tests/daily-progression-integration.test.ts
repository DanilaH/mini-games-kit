import { describe, expect, it } from 'vitest';
import { planDailyCompletion } from '../examples/daily-progression';
import type { DailyProgressExample } from '../examples/daily-progression';

const seedBalance = (n: number) => n === 3 ? 1 : n > 0 && n % 7 === 0 ? 3 : 0;
const fresh = (): DailyProgressExample => ({ completedDays: [], streak: null, hints: { wallet: 0, revealedKeys: [] } });

describe('whole daily progression snapshot example', () => {
  it('recreates donor 3/7/14 bonus milestones through reloads without double grants', () => {
    let state = fresh();
    for (let n = 1; n <= 14; n++) {
      const day = `2026-11-${String(n).padStart(2, '0')}`;
      state = planDailyCompletion(state, day, day, seedBalance);
      state = JSON.parse(JSON.stringify(state)) as DailyProgressExample;
      expect(planDailyCompletion(state, day, day, seedBalance)).toBe(state);
    }
    expect(state.hints.wallet).toBe(7);
    expect(state.streak).toMatchObject({ count: 14, best: 14 });
  });
  it('archive completion counts towards collection without fabricating a live streak', () => {
    const state = planDailyCompletion(fresh(), '2026-11-01', '2026-11-09', () => 99);
    expect(state.completedDays).toEqual(['2026-11-01']);
    expect(state.streak).toBe(null);
    expect(state.hints.wallet).toBe(0);
    expect(() => planDailyCompletion(state, '2026-11-10', '2026-11-09', seedBalance)).toThrow(/future/);
  });
  it('a failed durable commit can discard the plan and retry from the last saved snapshot', () => {
    const saved = fresh();
    const bonus = () => 2;
    const failedPlan = planDailyCompletion(saved, '2026-11-09', '2026-11-09', bonus);
    expect(saved.hints.wallet).toBe(0);
    const retry = planDailyCompletion(saved, '2026-11-09', '2026-11-09', bonus);
    expect(retry).toEqual(failedPlan);
    expect(retry.hints.wallet).toBe(2);
    expect(planDailyCompletion(retry, '2026-11-09', '2026-11-09', bonus).hints.wallet).toBe(2);
  });
});
