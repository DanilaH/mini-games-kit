# Continuing a transition after a fullscreen ad

This is a copyable recipe, not a new exported ad adapter. See `examples/foreground-transition.ts`; use the existing [activity coordinator](GAMEPLAY_ACTIVITY.md) and [native ads contract](../android/ADS_AND_LIFECYCLE.md). Source: Water Sort `2f86c1e`, JS bug8fe0f71 and native bug407a38f.

## Independent completion conditions

Persist the completed game state before offering the transition. Capture an exact source attempt/content key and target, then request the ad. Keep the request in memory until **both** the ad call settles and independent visibility/native/ad blockers permit navigation. Re-evaluate on both SDK settlement and activity changes. The caller also checks current screen, victory, save uncertainty and reward operations; activity alone does not encode those.

```ts
const transition = new ForegroundTransition<string, number>(); // copied example
const recheck = () => transition.tryRun(currentAttemptKey(), canNavigate(), openLevel);
const unsubscribe = activity.onBlockReasonsChange(recheck);
const ticket = transition.request(currentAttemptKey(), nextLevel);
try { await ads.show(); }
catch { /* A failed/no-fill attempt still permits the user's requested transition. */ }
finally { transition.complete(ticket); recheck(); }
// Explicit menu/restart/level selection/Undo: transition.cancel().
// Teardown: unsubscribe(); transition.cancel().
```

`canNavigate()` must include all current blockers, including the active-ad lock. Consume the request **before** invoking navigation, to prevent duplicate/resumed/reentrant events from advancing twice. A replaced/cancelled request cannot be revived by an old callback. Source key equality must include the attempt identity when a restart can reuse the same content key. Do not persist this example as process-death navigation recovery. No timeout authorizes resuming under a genuinely shown ad. The example does not choose retry UI if navigation itself throws; its request remains consumed.

## Native ownership is a separate failure boundary

Water Sort's first JS fix did not fix a native lost callback. Activity resume/JS prepare began preloading after the initial load backoff elapsed, incremented a shared generation and invalidated the dismissal callback of the active show. The bridge promise and fullscreen lock remained pending. Use distinct ownership for loading and active presentation, or forbid preload while a show/bridge call/shared fullscreen lock is active. Always settle the exact original call once on dismissal/error/destruction; stale callbacks must not affect a replacement session. A timer may bound pre-show waiting, not infer dismissal or earned reward.

The original failing Java fixture plus the fixed plugin are exercised by `tools/test-native-ads.py --baseline` and without the flag in Water Sort. The kit consumer probe runs both and records their outputs. They use SDK doubles and actual plugin code; they do not prove real SDK inventory/lifecycle delivery.

## Acceptance

Test dismiss-before-resume and resume-before-dismiss, overlapping blockers, long ad beyond preload backoff, repeated prepare/resume, late/duplicate dismissal, no-fill/show error, shared rewarded lock, destruction and explicit cancellation/replacement. In tests, verify the original bridge call resolves, no lock remains, transition occurs once and pause UI still works. Do not interpret a compile error as successful reproduction of the old bug.
