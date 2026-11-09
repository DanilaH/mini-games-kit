# Rare in-app review requests

Production recipe, no exported API or SDK dependency. Source: `engagement.ts`, `main.ts` and `SeedsEngagementPlugin.java` at [Seeds 1.1](../extraction/SEEDS_110.md). Android/RuStore integration is consumer-owned; this is not the Yandex Games web adapter.

## Eligibility and lifecycle

Keep active play time, qualifying sessions, request attempts and last-attempt timestamp in durable state. Count actual eligible foreground gameplay rather than ad/background dwell or every render. Require enough experience and a natural saved result. Thresholds, limits, cooldown and supported store belong to the product; the source's exact numbers are not kit defaults.

Coordinate review, notification permission and fullscreen advertising through the existing [activity reasons](../platform/GAMEPLAY_ACTIVITY.md). Show at most one external flow at a time. Give a first daily result to the notification explanation when appropriate and leave a configurable quiet interval after another external window. Gameplay and its saved result must remain usable when any optional SDK is missing, unavailable, unauthorized, limited or fails.

The source bridge separates prepare and launch:

1. Check eligibility, foreground/recovery state and the exact completed attempt. Persist the attempt/cooldown before SDK work; ambiguous persistence must be recovered before another prompt.
2. Prepare off the input path with a finite pre-launch deadline. Tag the operation with a generation, clear ownership when it ends, ignore late callbacks and discard stale prepared tokens. A deadline ends waiting, not the native request itself.
3. Immediately before launch recheck foreground, current attempt/result, SDK token freshness and conflicting windows. Never open a prepared form merely because a late success arrives after navigation/background.
4. Once the SDK owns a visible form, let that flow finish. Do not use a preparation timeout to resume underneath or forcibly close the visible form. Resolve bridge calls on teardown and invalidate stale generations.
5. Release only this flow's blocker. Another ad, background or recovery reason may still block the game.

Separate outcomes such as ready, unavailable, already reviewed, rate limited, unauthorized, prepare timeout, SDK error and flow finished. A completed SDK flow does **not** establish submitted stars/text or a confirmed rating. Do not emit a fabricated review-submitted conversion. Skip automatic repeat prompts when the product/SDK outcome requires it.

The reusable product recipe gives no hints, currency or access for rating, launching or finishing the form, and does not pre-screen people by expected star count. Native review UI stays unmodified. No custom five-star funnel, hard dependency on a response or invented rating confirmation is introduced.

## Acceptance

Test insufficient experience; repeated renders/results; reload after attempt persisted; save failure/ambiguous write; missing/outdated store and unauthorized user; already-reviewed/rate-limited outcomes; missing/late prepare callback; navigation/background during prepare; stale prepared token; simultaneous ad/permission; destroy during each stage; normal close without a rating. Confirm actual presentation on a published, correctly signed store build separately from mocks/harnesses.

Official source checked 2026-11-10: [RuStore Reviews SDK 10.5.2](https://www.rustore.ru/help/sdk/reviews-ratings/kotlin-java/10-5-2). This pins the donor documentation, not a perpetual dependency recommendation; verify the current supported integration before release.
