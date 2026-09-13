# Audio presentation primitives

Initial extraction source: `DanilaH/cases-yg` / Signal 2000, reference revision `26598606c8b0e143c9c97961bcdd8e03fd37bc61`.

The expensive reusable lesson is not Signal 2000's exact Y2K sounds. It is the ownership model behind them.

## `PresentationAudioMixer<State>`

The mixer owns lifecycle, not game semantics:

`baseline layer → temporary foreground duck → one persistent owned state → progress modulation → release/replace → baseline restore`

It keeps at most one persistent foreground state active, preserves a long-lived baseline instead of recreating it on every result, and suspends/resumes one existing `AudioContext` for mute/block lifecycle.

Games provide factories that define their own timbre and state identifiers. A project may use rarity names, weather states, danger levels, crafting phases, or anything else without putting those nouns into the kit.

The mixer never owns durable gameplay state.

## `ContinuousNoiseTexture`

A reusable WebAudio graph for continuous tactile feedback from normalized interaction `progress + velocity`. It extracts the graph/envelope behavior that made Signal 2000's tear interaction feel materially more tactile:

- band-passed loopable noise;
- progress/velocity-driven gain, brightness and Q;
- startup velocity cap and attack to prevent a harsh first-frame burst;
- short idle decay when movement pauses;
- deterministic release/disconnect.

The project's input system owns geometry and decides when to call `update()` or `stop()`.

Signal 2000's current drag profile can be passed directly as configuration; it is not a kit default because another game's material may need a different sound.

## Pitch helpers

`applyBoundedPitchVariation()` removes obvious repeated one-shot stamping without changing cue identity.

`getAccumulationPitchMultiplier()` creates one bounded contour across a semantic transfer sequence. It should reset for a new transaction, not for every visual sub-leg of the same transaction.

## Explicit non-goals

The kit does not contain:

- Signal 2000 cue names;
- Common/Rare/Epic/Legendary/Secret identities;
- the Y2K base ambience frequencies;
- CHIPS pitch/timbre constants as defaults;
- Hidden Pocket ownership rules;
- music composition or an asset pipeline.

Those remain per-game profiles layered on the reusable lifecycle primitives.
