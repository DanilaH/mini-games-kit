export interface TierProgress {
  readonly tierIndex: number;
  readonly target: number;
  readonly filled: number;
  readonly ratio: number;
  readonly complete: boolean;
  readonly earnedTiers: number;
  /** Tier after the displayed one; may be previewed before the displayed tier is earned. */
  readonly nextTier: { readonly tierIndex: number; readonly target: number; readonly remaining: number } | null;
}

/** Keeps an exactly reached tier visible for its receipt; otherwise displays the next unearned tier. */
export function getTierProgress(value: number, thresholds: readonly number[]): TierProgress {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('Invalid tier progress value');
  if (!Array.isArray(thresholds) || thresholds.length === 0 || Array.from(thresholds).some((n, i) =>
    !Number.isSafeInteger(n) || n <= 0 || (i > 0 && n <= thresholds[i - 1]!),
  )) throw new RangeError('Tier thresholds must be positive increasing safe integers');
  const candidate = thresholds.findIndex(target => value <= target);
  const tierIndex = candidate === -1 ? thresholds.length - 1 : candidate;
  const target = thresholds[tierIndex]!;
  const filled = Math.min(value, target);
  const following = thresholds[tierIndex + 1];
  return {
    tierIndex, target, filled, ratio: filled / target, complete: value >= target,
    earnedTiers: thresholds.filter(n => value >= n).length,
    nextTier: following === undefined ? null : { tierIndex: tierIndex + 1, target: following, remaining: following - value },
  };
}
