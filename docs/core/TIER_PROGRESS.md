# Tier progress and a visible next reward

Import `getTierProgress` and `TierProgress` from `@danilah/mini-games-kit/core`. No rendering, browser or SDK dependency.

```ts
import { getTierProgress } from '@danilah/mini-games-kit/core';

const view = getTierProgress(uniqueCompletedDays, projectMonthlyThresholds);
renderMedal(view.tierIndex, view.ratio, view.complete);
renderFollowingMedal(view.nextTier); // null after the final displayed tier.
```

The result contains `tierIndex`, cumulative `target` and `filled`, bounded `ratio`, `complete`, `earnedTiers` and an optional `nextTier` with its index, target and remaining count. Counts and thresholds must be safe integers, value nonnegative and thresholds positive, nonempty and strictly increasing. Invalid inputs throw `RangeError`.

For the source policy `[7, 14, daysInMonth]`:

| Completed | Displayed tier | Fill | Following preview |
| --- | --- | --- | --- |
| 6 | First | 6/7 | Second, 8 remaining |
| 7 | First, earned | 7/7 | Second, 7 remaining |
| 8 | Second | 8/14 | Third, month total minus 8 |
| 14 | Second, earned | 14/14 | Third |
| Month complete | Third, earned | Full | None |

The exactly earned tier stays visible at its boundary so its receipt is readable; the next completion advances the displayed tier. `nextTier` means the tier following the displayed one, not always the nearest unearned milestone. Before the displayed tier is earned, label the preview accordingly. Progress is cumulative, not restarted at zero for each metal. Values beyond the final threshold clamp the visible fill to full.

The function does not grant rewards, infer uniqueness, remember whether a celebration played or define months. The consumer supplies validated totals and thresholds. This is intentionally separate from a daily streak: archive tasks may fill a month's medal without repairing a live-day series.

## Presentation recipe

Preserve the source's independently useful presentation rules without importing its artwork:

1. Show one large filled silhouette and an explicit earned badge outside the artwork; preserve its contrast at thumbnail and enlarged-text sizes. Keep a separate outline/name/count for the following reward.
2. Trigger a finite celebration only after the exact completion and reward commit. A pending save may be displayed as pending but must not look like a durable earned receipt.
3. A local burst may combine pop, sheen and a bounded number of complementary rectangular/diamond/strip particles. Palette, shapes, count and duration belong to the game. Do not attach progression to an animation's `finished` callback.
4. Return an idempotent cleanup that cancels every owned animation and removes its layer. Run it on navigation, background, resize and replacement. With reduced motion show the final static earned state. Restoring a save or reopening a collection does not replay a previously completed receipt.
5. Measure origin/target geometry once per effect, avoid frame-by-frame layout reads and keep decorative layers outside input hit testing. Repeated reuse must not accumulate nodes, listeners, timers or pending callbacks.

Source reference: `src/trophies.ts::trophyMark/celebrateTrophy` at the revision in [Seeds 1.1 provenance](../extraction/SEEDS_110.md). The raw DOM/SVG renderer is not a portable exported module: it embeds the source's artwork, selectors, copy and balance. Reuse this model and recipe with the consumer's renderer or the existing [presentation skip](PRESENTATION_SKIP.md)/[value transfer](VALUE_TRANSFER.md) primitives as appropriate.
