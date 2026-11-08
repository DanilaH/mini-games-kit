# Low-pressure puzzle UI, progress and feel

Implementation requirements extracted from [Seeds](SEEDS_EXTRACTION.md). This is a reusable specification; the game supplies its own mechanics, balance and art direction.

## UI that behaves like a game

Use one clear primary play/continue action, with current progress or the next concrete task visible nearby. Review the whole viewport at actual device sizes: a menu occupying one quarter of a tall screen may feel abandoned. Rebalance composition and useful progress information before adding decorative cards or marketing copy. Retain safe areas and banner reservation while changing composition; removing unused-looking space must not remove an ad slot.

Keep one restrained accent and neutral surfaces for a large task library. Use selected/current/completed states, typography and small markers to express meaning rather than giving every notebook a different saturated color. Do not depend on color alone. A completed task should show its result immediately, without a redundant expand/collapse action. Remove or disable gameplay-only hint/undo controls once the board is complete.

Keep main actions reachable, preserve focus/scroll when returning from nested screens, and implement Android Back through the actual navigation stack before backgrounding from home. A large board should scroll in its own region without losing essential controls or creating horizontal page overflow. Test phone portrait, short phone landscape, tablet portrait/landscape, dark mode and enlarged text with actual maximum-size content. A width breakpoint alone is not evidence of adaptation.

## Undo-safe long progression

Durable progression is a separate model from the board and animation. One low-cost mechanism from `jars.ts::collectPair` is an **attempt id plus rewarded move-depth high-water mark**:

```text
new attempt -> checkpoint = 0
if currentDepth > checkpoint:
    checkpoint = currentDepth
    add durable reward
else:
    no reward
persist attempt id + checkpoint + progression together
```

Undo, replay and branches below the checkpoint cannot repeatedly farm the same depth. This deliberately rewards new depth, not every distinct alternative action; another game's policy may differ. Load/reset/backup behavior must preserve that choice. Collection names, thresholds and growth curve remain consumer policy. UI counters may animate toward already-persisted values; animation completion never earns the reward.

For hints, identify the actual revealed information (in Seeds: board state plus unordered pair), not simply button presses. A repeat reveal after undo/reload can remain free. Persist spent keys and earned bonuses with the attempt. Keep identities bounded in size; do not store a full huge board string for every repeated action. Hashing is an implementation choice, not a reason to copy Seeds' handwritten SHA implementation.

## Deterministic tasks and daily archive

- Separate puzzle content version, save schema version and attempt identity. Reopening a daily task must not silently change its board after a generator upgrade.
- Generate the day seed from an explicitly defined calendar/timezone policy; avoid accidental UTC/local-day disagreement. Validate calendar components by round-trip comparison, not only `YYYY-MM-DD` regex or Date normalization. Cover invalid months, leap days, century exceptions, future dates and imported saves.
- A long archive should generate/select valid tasks by date without preloading years of screens. The archive start date and reward policy belong to the game.
- Validate the entire finite catalog for legal initial state, intended uniqueness and a legal completion witness where available. In Seeds this included 2,400 boards. A generated witness proves reachability under the tested rules; it does not prove enjoyable difficulty. Verify rules with an independent checker, not just the generator's own helper.
- Show meaningful task-group progress and a continuation point. Huge late tasks must be readable/scrollable on a small landscape screen, not merely render on a desktop fixture.

## Bounded analysis worker recipe

Seeds' `advice-client.ts` runs expensive hint analysis in a dedicated Worker with a time budget and an `unknown` fallback. Preserve that boundary for any costly solver:

1. Snapshot the board/attempt or attach a revision id before posting work.
2. Bound both computational search and wall time. Creation errors, worker errors and deadline expiry produce a usable unknown result, not a frozen screen.
3. On the first completion, clear the timer, detach handlers and terminate the worker. Make settlement idempotent. On navigation/disposal terminate outstanding work; reject/ignore results whose attempt or revision no longer matches.
4. Never interpret `unknown` as a proven dead end, or consume a paid hint for a result that revealed no useful information. Keep solver proof quality separate from UI assistance wording.

This is a recipe, not a new worker pool abstraction. Cancellation/stale-result guards are extraction requirements beyond the minimal source helper.

## Small, bounded feedback

`seed-flight.ts` uses precomputed curved Web Animations transforms: measure source/target once, vary curvature/duration by geometry, limit simultaneous tokens, remove finished elements, and honor reduced motion/background. Reuse the existing [value-transfer planner](core/VALUE_TRANSFER.md) to decouple semantic reward from token count; define cleanup for rotate, navigation and rapid repeated actions. No per-frame layout reads or full-screen canvas are required for two flying dots and trails.

Skipping/cancelling visual feedback must preserve the final displayed total and already-saved progress. Seeds settles outstanding presentation callbacks on `clear`; game state must not depend on those callbacks. Test immediate leave, background, reduced motion, overflow of the active-token budget and repeated reuse for DOM/listener leaks.

Short procedural WebAudio cues can avoid heavy sound assets, with restrained volume, pitch variation and a configurable voice limit. Use the kit's [audio lifecycle](audio/PRESENTATION_MIXER.md) where applicable, and explicitly test suspended context **with every voice slot occupied**: resume/cleanup must not depend on a new free slot. The original Seeds `sound.ts` is excluded from direct extraction because that stress case exposed a deadlock.
