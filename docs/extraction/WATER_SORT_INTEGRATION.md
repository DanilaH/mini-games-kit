# Water Sort production extraction

Source `DanilaH/watery-water-sort@2f86c1eaa311e2da1de11f69d5df8b11f28e6c0d` (Phaser3.90/Capacitor). Kit baseline 6373417 includes Seeds PR14 and Road Lines PR16. This package supplements those contracts; it does not upgrade the shipped game or claim Phaser4-specific helpers work in Phaser3.

## Changes and boundaries

| Deliverable | Implementation and intentional differences |
| --- | --- |
| Native safe area | `resolveNativeSafeAreaCss` extends the existing layout module, generalizing Water Sort's bottom inverse to four edges and rejecting invalid/disjoint geometry; existing placement semantics unchanged |
| Continuous feel | `stepDampedMotion` generalizes `stepLiquid` with explicit underdamped tuning, validation and no game defaults; exact source tuning remains in the consumer adapter |
| Ad return | Copyable foreground-transition example, activity integration tests and original native negative/positive controls; no new ad SDK/runtime or automatic crash navigation recovery |
| Help/economy | [Recipes and matrix](WATER_SORT_PRODUCTION.md): consistent route remainder, knowledge boundary, proven shuffle, separate inventory, post-ad intended purchase and no automatic spending |
| Content | Historical attempt/rating/awarded-high-water migration example and tests retained in the real consumer |
| Presentation/performance | Interruption semantics, shared material boundaries, finite effects, actual rendered reflow positions, final paint and local cache invalidation |
| Acceptance | Isolated real Phaser3 consumer, Java/TypeScript geometry parity, SDK-race fixture, source flow tests and explicit evidence limits |

Do not duplicate `DurableReceiptQueue`, `GameplayActivityCoordinator`, `OneShotPlayer`, value-transfer or startup modules. Haptics remain a separately audited native recipe with consumer profiles. No WaterScene renderer, colors/art, level bank, solver, wallet prices, prefab pause UI or universal Android bootstrap enters the portable API. Future hinted-route extraction needs another consumer rather than an abstract solver framework now.

## Reproduce

Install dependencies in kit and Water Sort, install Playwright Chromium for browser acceptance, and have Python3/JDK17+ available. From kit root:

```sh
npm run typecheck
npm test
npm run build
node tools/water-sort-consumer-probe.mjs --source /absolute/path/to/watery-water-sort --browser
npm run pack:check
npm run bootstrap:check
npm run bootstrap:smoke
npm run test:browser
```

The probe makes an ignored temporary copy, copies two donor source files and replaces **only** the game's oscillator implementation using a guarded adapter. All game tuning, stream/cork profiles, model, save format, input and art remain source-owned. A600-step equivalence scenario compares the unchanged source oscillator with the donor across impulses, timestep and force changes. Existing built consumer tests exercise visual liquid lifecycle and real assistance/economy UI with a mocked native bridge. The foreground-transition recipe has separate kit tests; it is not substituted into the released native/JS controller. Java geometry executes the actual source class against the same six size fixtures used by TypeScript, without a transcribed native formula. Native ad controls compile the original 0.44 fixture (expected specific failure) and current plugin with SDK doubles.

Build/type tests, actual automated flow and native control-flow evidence are distinct. No device haptics/listening, target-device GPU/FPS, real SDK inventory, analytics dashboard delivery, process-death release smoke, signed APK or store publication is claimed by this kit extraction. The temporary consumer is not a versioned vendor dependency upgrade. The run records donor/consumer revisions, dirty flags, donor/native hashes, per-command results and limits in `.test-output/water-sort-consumer.json`; copy the successful record into provenance only after inspecting the results. See the committed validation record for the completed run.
