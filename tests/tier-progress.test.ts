import { describe, expect, it } from 'vitest';
import { getTierProgress } from '../src/core/index';

describe('tier progress and earned milestone receipt', () => {
  it.each([
    [0, 0, 7, false, 0], [6, 0, 7, false, 0], [7, 0, 7, true, 1],
    [8, 1, 14, false, 1], [14, 1, 14, true, 2], [15, 2, 30, false, 2],
    [30, 2, 30, true, 3], [100, 2, 30, true, 3],
  ])('projects %i without replacing an exactly earned tier', (value, tierIndex, target, complete, earnedTiers) => {
    const result = getTierProgress(value as number, [7, 14, 30]);
    expect(result).toMatchObject({ tierIndex, target, complete, earnedTiers });
    expect(result.ratio).toBeGreaterThanOrEqual(0);
    expect(result.ratio).toBeLessThanOrEqual(1);
  });
  it('previews the following tier with its actual remaining amount', () => {
    expect(getTierProgress(6, [7, 14, 30]).nextTier).toEqual({ tierIndex: 1, target: 14, remaining: 8 });
    expect(getTierProgress(7, [7, 14, 30]).nextTier?.remaining).toBe(7);
    expect(getTierProgress(8, [7, 14, 30]).ratio).toBe(8 / 14);
    expect(getTierProgress(30, [7, 14, 30]).nextTier).toBe(null);
  });
  it('supports other catalogs, a leap month and a single tier', () => {
    expect(getTierProgress(29, [7, 14, 29]).complete).toBe(true);
    expect(getTierProgress(5, [5])).toMatchObject({ complete: true, nextTier: null, earnedTiers: 1 });
    expect(getTierProgress(3, [4, 10]).nextTier?.target).toBe(10);
  });
  it('rejects invalid values and nonincreasing/empty thresholds', () => {
    for (const thresholds of [[], [0], [7, 7], [14, 7], [7, NaN], [7, 8.5], [Infinity]]) {
      expect(() => getTierProgress(0, thresholds)).toThrow(RangeError);
    }
    for (const value of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => getTierProgress(value, [1])).toThrow(RangeError);
    }
  });
  it('rejects sparse thresholds rather than producing an undefined target', () => {
    expect(() => getTierProgress(0, new Array<number>(2))).toThrow(RangeError);
  });
});
