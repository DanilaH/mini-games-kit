# Seeds 1.1.2: compact banner and initial-action acceptance

Donor: `DanilaH/seeds-bits@24ae94ffbe4a2652b8e3ce410c6e15d74ef251d9`, release
branch `release/rustore-1.1.2`. Runtime `c6c99ce192c6e0c1ae992a65e8c26b446199e19d`,
version 1.1.2; prepared RuStore APK 1102101. Kit baseline
`f154e0b537e395309763e0dd6514725c7196f690`. This is a follow-up to
[Seeds 1.1](SEEDS_110.md), not a rewrite of the dated audits or an application upgrade.
Store publication/live SDK acceptance is not inferred from release preparation.

| Donor behavior | Kit change | Boundary |
| --- | --- | --- |
| SDK-selected compact inline creative, measured CSS height, once-owned inset, resize versus retry | Extend [Android ads recipe](../android/ADS_AND_LIFECYCLE.md#compact-banner-integration) | 50dp, SDK version, retry interval, spacing and host visibility remain consumer policy |
| Bottom-aligned native creative | Optional `verticalAlign: 'bottom'` in existing [placement API](../layout/NATIVE_BANNER_PLACEMENT.md) | Omitted/default center unchanged; retain kit inward rounding and safe-root/WebView guards |
| Continue/cancel/actions available before scrolling | [Stable UI recipe](../layout/STABLE_PROGRESS_UI.md#critical-actions-in-the-initial-viewport), opt-in Playwright QA helper and negative fixtures | No shared application CSS, DOM selectors or native hitbox guarantees |
| Different completion feedback, slow save/retry/navigation safety | Extend saved-result acceptance in the same stable UI recipe | Group sizes, artwork, generator, haptic/audio profiles stay in the game |
| Completion/start journal sent after successful save with attempt IDs | [Committed analytics recipe](../platform/COMMITTED_ANALYTICS.md) and current-status addendum to the historical audit | Outbox class remains CANDIDATE; no new runtime queue or exactly-once/server-delivery claim |
| Authentic edited store videos | [Media production check](../LOCALIZATION_AND_STORE_MEDIA.md#edited-video-first-frame-check) | Source recordings, captions and store layout stay project-owned |

## Concrete source evidence

- `f8ca30d` and `53bd826`: `native/android/SeedsMonetizationPlugin.java`,
  `src/monetization.ts`, `src/style.css`, `e2e/banner-adaptation.spec.ts` and
  `scripts/regression-061/native-harness.py`. The source records 50dp maximum,
  WebView/density separation, under-45-CSS-height acceptance, bottom attachment,
  slot recovery and width/retry cases. Kit geometry intentionally differs from
  donor `Math.round` mapping; it is not replaced by copied native code.
- `f68d02e` / `37e3163`: pinned result/hint/game actions and
  `scripts/interface-audit-followup.mjs`. Donor initial-action failures fell
  from 19/30 to 0/30 controlled states. This is historical donor evidence, not a
  new measurement from the generic fixture. Five result profiles include 150/200%
  text, short landscape and themes.
- `90d1a85` / `c6c99ce`: aligned result statistics, compact illustration fallback,
  reduced motion and visible actions. `src/result-presentation.ts` identifies a
  just-completed group by completion order; its 6/24 group sizes are game policy.
- `729b50a`: slow-save jar milestone identity and cancellation guards; the
  source test holds saving for 600ms and retains the full jar through its spill.
  This does not prove arbitrary storage delays beyond the presentation expiry;
  the kit recipe calls for an explicit retention/drop policy and a longer-delay test.
- `src/analytics.ts`, `src/main.ts::save/complete`, `tests/analytics.test.ts`:
  bounded journal and successful-snapshot dispatch. Nine targeted donor analytics
  and result-classification tests passed in the investigation. Dashboard delivery
  and live ads were not tested by that unit run.
- `DanilaH/design/seeds-bits/rustore`: store exports from the same APK web assets,
  with raw capture hashes and edits. Resetting input PTS removed a blank first
  frame introduced by video composition. No game artwork is copied into kit.

## Validation and intentional limits

`tests/native-banner-placement.test.ts` exercises unchanged center coordinates,
opt-in bottom alignment, parent padding, SDK height negotiation, inward-rounded
fractional edges, compact 40/60/80 CSS reservations, and rejection boundaries.
`npm run test:browser` also runs `tools/critical-actions-acceptance.mjs`: 16
rendered layout profiles and 7 deliberately broken controls, with actual coordinate
clicks for positives and no automatic scroll. Reports/screenshots are written to
`.test-output/ui-acceptance/`. These fixtures validate the helper/layout recipe;
they do not retest the source app, Android text glyphs, native overlays or TalkBack.

The CI native-reference job compiles the **unchanged pinned donor Java bridge**
against its original deterministic Android/SDK doubles. Install the donor locked
dependencies first (`npm ci --ignore-scripts`): the fixture also compiles the real
Capacitor Preferences Java sources. CI uploads the 30-case
result with source and harness hashes. This tests source callback/geometry history;
it is not an adapter of the new kit option into a shipped APK, an actual SDK show
or evidence that other consumer dependencies were upgraded.

Consumer adoption remains deliberate: retain existing runtime pins and test the
actual new integration separately. No Android/Capacitor bootstrap, automatic
ad cadence, save migration, difficulty director or new presentation engine is added.
