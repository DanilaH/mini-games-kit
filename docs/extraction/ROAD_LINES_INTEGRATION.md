# Road Lines production extraction

Source `DanilaH/road-lines@5e05ddc205f113544cf3957032ae119df0d47c93`. Review and exclusions: [audit](ROAD_LINES_AUDIT_2026-11-08.md). This extraction is layered over Seeds PR14 head d4dee18; it neither duplicates DurableReceiptQueue nor merges that PR automatically. Retarget the stacked PR to main after Seeds integration.

## Code and intentional changes

- GameplayActivityCoordinator gains reason snapshots/subscription while aggregate callbacks retain their contract. Duplicate reason assignments do not notify.
- Touch activation is parameterized by button resolver/limits; no .play-controls, game actions or imported UI.
- polylineMarkers preserves one arc phase, with input validation and a bounded marker budget added for library callers.
- MusicalSampleSequence removes Road Lines' level hashing/cue names and takes phrase, variants and interval limits. Actual recordings must share one root.
- OneShotPlayer preserves cold synchronous fallback, bounded feedback, UI eligibility and suspended cleanup. Sprite decoding/assets, haptics, cue volumes and game orchestration are not copied. It can own a context or borrow the application context with ownsContext:false when composed with the existing persistent mixer.
- destroyRenderer preserves Phaser's final-step teardown for sleeping games.

Native ads, receipt storage, haptics, full-screen cadence, storefront identity and artwork stay consumer-side. Existing playbooks are extended with optional-SDK nonblocking recovery, reason-aware feedback, dirty/idle rendering, finite caches, first paint, native analytics contract parity, release-payload checks and haptics integration requirements. No universal Android bootstrap, Fill solver, gift/wheel economy or automatic migration of consumer vendor snapshots is introduced.

## Validation and integration boundary

Portable tests cover old/new activity semantics, polyline phase/clearance/invalid budgets, musical phrase/anti-repeat and existing storage/receipt/asset contracts. `npm run test:browser` exercises real touch/keyboard/WebAudio and real Phaser teardown at CPU1×/4× where applicable. It is separate from unit tests and requires Playwright Chromium.

The consumer probe tool temporarily replaces only matching Road Lines vendor files/helpers in an isolated source copy, preserving the actual model, saved-state and input flows. It records exact donor/consumer SHAs and runs the appropriate existing source tests/browser flows; it does not rewrite the released game's vendor manifest. See the validation evidence added after the run for exact commands/results. No live SDK inventory, AppMetrica dashboard delivery, physical sound/haptics or store publication follows from these checks.

## Reproduce the isolated consumer check

Install dependencies in both checkouts, build kit, then run from the kit root:

```sh
npm run build
node tools/road-lines-consumer-probe.mjs --source /absolute/path/to/road-lines
```

Use consumer source b62eb11 or its published tree-equivalent analytics-fix revision5919ca0. The probe creates its own ignored directory, copies only selected donor primitives, adapts touch/geometry/sequence/teardown imports and runs real consumer flow tools. It deliberately does not run verify:kit against this temporary modified snapshot or assert the original manifest is still valid. The tracked consumer retains its pinned vendor and normal manifest check. OneShotPlayer is additionally tested with the real decoded Road Lines audio sprite in the browser fixture; the complete game Feedback class is not replaced in that probe. Source/font/art/economy and normal production payload remain consumer-owned.
