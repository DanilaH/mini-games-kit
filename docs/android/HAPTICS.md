# Native haptics: priority and cancellation

Android integration recipe, not an exported vibrator/Capacitor API. It extends the Road Lines feedback contract using `haptics.ts` and `SeedsFeedbackPlugin.java` at [Seeds 1.1](../extraction/SEEDS_110.md). Sound and vibration preferences remain independent.

## Source bridge pattern

The source uses `configure({ enabled, epoch })` and `pulse({ cue, epoch, issuedAt })`. Treat this as a protocol recipe rather than a package import: each consumer maps its own cues to durations, amplitude, priority, minimum gap and protected interval. Missing hardware or optional bridge failure must not interrupt input or saving.

The expensive lesson is cancellation ordering across an asynchronous JS/native bridge:

1. JS advances a monotonically increasing epoch whenever enabled/block state changes, and refreshes configuration on native resume. It immediately invalidates pending JS pulses and clears its interval/protection state.
2. Native accepts configuration only if its epoch is strictly newer; a delayed old enable cannot undo a newer disable. Applying a new epoch cancels the motor and resets native timing state.
3. A pulse carries the epoch captured when the action occurred. After awaiting configuration, JS rechecks epoch, enabled/block/visibility state and freshness. Native repeats those checks before touching the vibrator; equality with the current epoch is mandatory.
4. Native pause/destroy invalidates its epoch, disables feedback and cancels the motor. A fresh resume configuration is required. Generation ownership and age checks solve different problems; a recently issued old-generation pulse must still be rejected.
5. Use a monotonic native clock for interval/hold calculations. A transported wall-clock issued time is a freshness guard, not a generation barrier. Handle clock jumps conservatively. Do not queue sensations to play after a blocked interval or background return.

## Priority and capability

Short interface actions may be frequent; completion can replace a lower-priority impulse inside its normal gap. A protected completion sequence suppresses low-priority token-arrival/tap feedback so its rhythm remains readable. Do not accumulate a delayed pulse queue or let a late landing replace a win. Exact profiles, strength, priorities and intervals are product tuning; softer is not automatically better.

Native code checks vibrator presence, API-level waveform/one-shot support and amplitude control, then falls back to supported effects. Every disable/pause/destroy path cancels active feedback. Web `navigator.vibrate` or a mocked bridge does not establish native motor response, waveform quality or user-perceived strength.

## Verification

An adapter harness should intentionally reorder configure/pulse callbacks: old enable after new disable; old pulse after resume; fresh old-generation pulse; stale current-generation pulse; pause/destroy before pulse; rapid taps followed by win and landing; no vibrator/amplitude support; SDK/runtime errors. Test that no path resumes gameplay or grants rewards from a haptic completion. Real phone checks cover independent sound/vibration preferences, motor strength, rhythm, foreground return and device capability fallback.

No source timings, amplitudes, cue names or preference defaults become kit constants. Do not copy `installInterfaceMotion` as a global framework installer: its source selectors and document-lifetime listeners need consumer-specific ownership/teardown if reused beyond one app lifetime. Existing [touch activation](../feel/TOUCH_ACTIVATION.md) owns activation semantics.
