# Event-driven onboarding playbook

This is production guidance, not a universal onboarding engine API.

For choosing whether to teach at all, what a player needs to discover in the first 30 seconds / 3 / 15 minutes, and how to run a real human FTUE test, consult the separate [FTUE diagnostic protocol](puzzle-design/FTUE_DIAGNOSTIC_PROTOCOL_2026-11-12.md) and its [independent audit](puzzle-design/FTUE_INDEPENDENT_EVIDENCE_AUDIT_2026-11-12.md). This document stays narrowly scoped to **durable, event-driven engineering**, not instructional design or universal tutorial policy. The FTUE time windows are observation heuristics, not runtime timers.

Signal 2000's first-run work showed that tutorial progression is substantially safer when guidance follows **semantic game events** rather than timers or presentation callbacks.

Examples of good gates:

- durable reward actually committed;
- a resource was actually gained;
- the next control is actually rendered, enabled and settled;
- the player performed the required interaction;
- a persisted first-run grant was confirmed after an ambiguous storage write.

Avoid advancing durable onboarding state merely because an animation ended. Presentation can be skipped, interrupted, restarted or destroyed while gameplay truth remains unchanged.

One-time grants/rewards belong in durable/recoverable state. If a write result is ambiguous, verify persisted state before deciding whether to grant again. The existing `DurablePendingTransactionSession` and JSON repository seams can support this, but the exact onboarding schema and reward policy stay in the game.

Guidance overlays should be restartable and scoped to the currently active scene/surface. A late event from a destroyed scene must not resurrect tutorial UI.

Do not extract a generic `OnboardingEngine` until a second real game demonstrates the same orchestration shape. Preserve this policy now; extract the smallest repeated mechanism later.
