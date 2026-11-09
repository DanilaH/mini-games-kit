# Seeds 1.1: daily progression and engagement extraction

Donor: [`DanilaH/seeds-bits`](https://github.com/DanilaH/seeds-bits), repository revision `3eb2b3cfd6c8aea3ca130f916290818fbf5ce7c5`; APK/runtime revision `e92bd4915d677caf47f74944402c82d48b483d9c`, version 1.1.0 / 1100024. These are distinct from the [original 1.0 extraction](../SEEDS_EXTRACTION.md). Kit baseline: `a9325265e87583a4872cf6a158e1e881a0d7508e`, after the Road Lines/Water Sort integrations and stability cleanup.

## Code versus recipe

| Preserved production behavior | Donor | Kit destination and intentional change |
| --- | --- | --- |
| Gregorian dates and live consecutive-day series | `src/calendar.ts`, `src/daily-run.ts`; `tests/update110.test.ts` | [Calendar/streak API](../core/DAILY_STREAK.md). Pure immutable plans, explicit today, no game Progress dependency, no fixed reward schedule; reject malformed state/unsafe arithmetic. |
| Free revealed-information quota plus shared earned hints | `src/hint-budget.ts`, `src/progress.ts` | [Hint budget API](../core/HINT_BUDGET.md). Configurable quota and credit amount, explicit result, no board hash/SDK receipt processor; ledger and durable commit stay with existing storage/receipt contracts. |
| Earned tier remains visible; following target is explicit | `src/trophies.ts::trophyMark` | [Tier model and effect recipe](../core/TIER_PROGRESS.md). Any increasing thresholds, validation, no artwork/monthly constants/DOM renderer. |
| A unique daily win updates completion, streak and wallet together | `src/progress.ts::recordCompletion`, `src/daily-run.ts` | Tested [pure integration example](../../examples/daily-progression.ts); an adapter must still commit/recover the full plan. |
| Inexact personalized local reminder and current-day entry | `native/android/SeedsDailyReminder.java`, `SeedsEngagementPlugin.java`, `src/main.ts` | [Android reminder recipe](../android/LOCAL_REMINDERS.md), not a copied scheduler reading Seeds private storage keys. |
| Rare native review request without a second competing window | `src/engagement.ts`, `SeedsEngagementPlugin.java`, `src/main.ts` | [Review recipe](../android/IN_APP_REVIEW.md). Product thresholds and SDK dependency remain local. |
| Priority haptics with generation/freshness cancellation | `src/haptics.ts`, `native/android/SeedsFeedbackPlugin.java` | [Haptic protocol recipe](../android/HAPTICS.md), extends existing Road Lines requirements; no bundled motor profiles. |
| Stable labels, completion marker and native time editor | `src/main.ts`, `src/ui-polish.css`, `e2e/update110.spec.ts` | [UI acceptance recipe](../layout/STABLE_PROGRESS_UI.md); no application CSS copied. |
| Old save survives changed economy and collection pacing | `src/progress.ts`, `src/jars.ts`, `tests/update110.test.ts`, release upgrade checks | Extended [release acceptance](../ANDROID_RELEASE_ACCEPTANCE.md), not a universal save migrator. |

The three reusable mechanisms plus their small calendar helper are framework-independent under `/core`, also reachable through the existing root core export. New-project discoverability is in [API](../API.md), README and the puzzle production guide. No Android or engagement bootstrap becomes mandatory for unrelated games.

## Extraction exclusions and limits

Do not import source package IDs, storage keys, native classes, exact hint allowance/bonuses, jar capacities/names/art, monthly emblems, notification text/timing/default preference, review counters/cooldown, day archive origin or analytics identifiers as universal defaults. The donor's exact 3/7/14 reward schedule appears only in provenance-oriented test fixtures.

Calendar and budget functions calculate one local state transition, not globally exactly-once grants, server-authoritative dates or concurrent-tab locking. Receipt deduplication stays in `DurableReceiptQueue` plus a durable ledger. Changes from mutable source code are explicit: create a full next snapshot, commit or recover through the consumer's single writer, then present/acknowledge. Failed or ambiguous persistence must not be papered over by a pure function returning success.

The source's January-2025 archive and monthly collection must not reconstruct new live streaks retrospectively. Existing completed dates remain valid progress, but archive completion and live-day attendance are separate. Collection pace migrations preserve lifetime total and earned positions/fraction without promising identical new capacity numbers.

Source Android/native acceptance and signed APK identity document what was built/tested, not an assertion that extracted APIs already ship in that APK. This change does not migrate the released game, rerun live advertising attribution, present an actual RuStore review form, measure a physical motor or guarantee OEM reminder delivery.

## Verification entry points

- `tests/daily-streak.test.ts`: malformed dates, early/century/leap years, boundaries, reload/repeat, skipped/archived/future days, backwards clock, immutable state and overflow.
- `tests/hint-budget.test.ts`: free-before-earned, repeated revealed information at zero balance, shared credit across attempts, denied reveal, invalid state and overflow.
- `tests/tier-progress.test.ts`: exact earned thresholds, following preview, cumulative/clamped fill and invalid thresholds.
- `tests/daily-progression-integration.test.ts`: source bonus policy through 14 serialized days, archive separation, duplicate completion and discard/retry of an uncommitted plan. No storage-atomicity claim is made by this fixture.

See the [local validation record](SEEDS_110_VALIDATION_2026-11-10.json). GitHub CI records the committed PR revision separately; neither result is inferred from the donor's release checks.
