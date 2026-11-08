# «Семечки»: reusable mechanisms and production specifications

Source: [`DanilaH/seeds-bits`](https://github.com/DanilaH/seeds-bits), revision `96caff6aac357e06b8373301b2b895544c9ef179` (2026-10-23). Shipped APK source: `86d950b970a69e5dec3ebc269075143a1c28f94a`; version 1.0.0 / 1000010. Store media is generated separately from the same game interface. The user submitted the release for moderation; approval and public release are not established.

This is an extraction map, not a declaration that every source implementation is safe to copy. The kit already contains many suitable primitives. Preserve production knowledge without turning the whole puzzle application into a framework.

Related: the independently added [Sudoku 0.17 extraction plan](extraction/SUDOKU_017.md) covers several of the same Android boundaries. Use the receipt queue and Android specifications here together with that plan rather than creating a second receipt processor or banner geometry contract. Sudoku now supplies the [revision snapshot queue](platform/REVISION_SNAPSHOT_QUEUE.md) and [native banner geometry](layout/NATIVE_BANNER_PLACEMENT.md). Profile isolation and cloud orchestration remain consumer requirements. See the [combined storage protocol](platform/DURABLE_RECEIPT_QUEUE.md#combining-with-revision-snapshot-saves) before composing ordinary saves with earned rewards.

| Practice | Reusable form | Source and boundary |
| --- | --- | --- |
| Earned video reward survives interruption and duplicate callbacks | New [`DurableReceiptQueue`](platform/DURABLE_RECEIPT_QUEUE.md), focused tests and adapter contract | `main.ts::receiveReward`, `hint-budget.ts`, native receipt/ack/persist methods; no hint economy or SDK dependency |
| Pause/input/audio remain blocked while an ad or background blocker exists | Existing [`GameplayActivityCoordinator`](platform/GAMEPLAY_ACTIVITY.md) + Android requirements | `main.ts`, `monetization.ts`; do not introduce another pause coordinator |
| Native banner has an explicit slot in portrait and landscape | Existing [native geometry](layout/NATIVE_BANNER_PLACEMENT.md) + [Android integration specification](android/ADS_AND_LIFECYCLE.md) | Native `applyBanner`, DOM `ad-space`, latest `ui-polish.css`; original monetization prose contains obsolete orientation restrictions |
| Earn progression once, even after undo/reload/branching | [Puzzle production specification](PUZZLE_PRODUCTION.md) | `jars.ts::collectPair` high-water checkpoint; retain attempt identity, not jar artwork/balance |
| Frequent small visual rewards without frame-by-frame layout work | Existing [value transfer](core/VALUE_TRANSFER.md) + [feel requirements](PUZZLE_PRODUCTION.md) | `seed-flight.ts`; game decides trajectory, color, sound and cancellation policy |
| Deterministic daily archive and large finite task library | [Puzzle production specification](PUZZLE_PRODUCTION.md) | `puzzles.ts`, `notebooks.ts`, `trophies.ts`; catalog, dates and difficulty remain local |
| Difficult analysis cannot freeze the UI | [Bounded worker recipe](PUZZLE_PRODUCTION.md) | `advice-client.ts`, `advice-worker.ts`; no universal solver or worker pool |
| Reproducible Android package, size reduction and exact artifact checks | [Release/QA checklist](ANDROID_RELEASE_ACCEPTANCE.md) | `configure-android.mjs`, release workflow, Android smoke/static checks |
| Authentic store screenshots with quiet explanatory captions | [Existing store-media playbook](LOCALIZATION_AND_STORE_MEDIA.md#5-phone-and-tablet-framing-with-factual-captions) | `store-capture.mjs`, `store-frames.mjs`; exact complete UI images, factual captions outside UI |

## Existing source defects must not become kit defaults

The independent source audit `docs/audit-2026-10-23/REPORT.md` found:

- Cross-tab preference updates can overwrite unrelated fields even when gameplay conflicts are detected. A lock alone is not proof of a correct complete read/merge/write protocol. Do not extract `saveState` unchanged or claim general cross-tab atomicity.
- Imported daily identifiers can contain impossible months. Regex and JavaScript Date normalization are insufficient calendar validation. Require round-trip year/month/day validation on every input path.
- Synthetic audio saturation plus suspension can leave the voice limit occupied before `resume()` is attempted. Do not copy `sound.ts` unchanged as an audio subsystem. Use the existing mixer and test resume while all voice slots are occupied.

These are explicit extraction exclusions. The current source files and the audit demonstrate them; this contribution does not fix the source game or pretend that a green release build resolves them.

## Deliberately left in the game

Pair rules, handwritten puzzle solver, exact 100 × 24 catalog, nine-column history codec, +3 reward, initial three hints, jar names/capacities, colors, calendar start date, SVG emblems and application-specific save migrations remain local. The history compressor assumes single decimal digits and nine-cell rows; a generic save compressor needs independent evidence before extraction.

No SDK versions, storefront limits, cooldown constants or fixed ad-slot heights are prescribed as permanent kit defaults. When using the Android specification, validate the target integration against current official platform documentation and the actual device. This contribution adds no Android bootstrap or dependency on Capacitor.
