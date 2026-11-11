# Android release and independent acceptance

## Updating an existing audience

Use an upgrade fixture from the actual published source/schema, installed first with the same package and test signing identity as the candidate. Temporary CI signing proves an in-place test update; separately verify the production signer on the delivered APK. Installing a fresh test package or clearing data cannot prove save compatibility.

Carry nontrivial unfinished progress into the update: board, undo/branch history, partially used free hints, earned balances, task completions, collection position and preferences. Include an unacknowledged earned native receipt where supported. Verify the updated game can continue, undo and complete; reloading cannot grant the same receipt or migrate bonuses twice. Future schemas and ambiguous read/write failures must preserve their recovery barriers.

When progression pacing changes, separately assert lifetime total, already earned collection position and current fractional progress; new capacity numbers may intentionally differ. When per-attempt bonuses become a shared wallet, credit only the remaining earned amounts once in the same schema-marked commit. Historical completed archive dates must not fabricate newly introduced live streaks. Define defaults for newly added settings without overriding explicit existing choices.

See [Seeds 1.1 provenance](extraction/SEEDS_110.md), [hint migration boundary](core/HINT_BUDGET.md) and [stable UI transitions](layout/STABLE_PROGRESS_UI.md). No game-specific save decoder or collection curve is provided by the kit.

Water Sort's [acceptance matrix](extraction/WATER_SORT_PRODUCTION.md) adds visible-frame versus DOM readiness, launcher-icon/payload consistency, historical attempts and interruption cases. Its [integration record](extraction/WATER_SORT_INTEGRATION.md) deliberately separates browser/native-double acceptance from signed-release/device verification.

Production checklist from [Seeds](SEEDS_EXTRACTION.md). It supplements, rather than replaces, platform-specific documentation. An item is only passed when its evidence is recorded; this document is not evidence that a future consumer has passed it.

## Reproducible build and size

Keep native customizations in versioned source/templates installed deterministically into generated Capacitor projects. Do not hand-edit ignored generated Android files and expect CI to reproduce them. Pin dependencies, record source revision and fail clearly when required integration configuration is absent.

Measure the actual signed release APK and its contents before optimizing. Distinguish APK size, download compression, installed size and runtime memory. Enable release code/resource shrinking with precise keep rules for reflection/bridge entry points. Retain SDK notices and mapping files; do not remove functional SDK components or device support just to reach an arbitrary size. Seeds reached a roughly 5.5 MB signed APK; that is evidence from one project, not a budget for every game.

After shrinking, check native bridge registration, reflective calls, WebView assets, startup, saved state and all ad paths on the release payload. A debug build passing tests does not verify R8 output. Keep stable package id and signing identity, monotonic store versionCode, human-readable versionName, public certificate fingerprint and SHA-256 of the **delivered** APK. Preserve the signing key privately; never commit it or put it in a store-media ZIP.

## Store listing and pre-submission materials

Use [Store Presence](store-presence/README.md) for RuStore-first store text, true gameplay screenshots, icon and store-specific rules. Art/signing/UI correctness do not guarantee listing compliance or conversion. Consumer must approve target stores, creative direction and actual submission; keep asset provenance and console preview evidence. Do not prepare Google Play / App Store resources unless they are genuine planned release targets.

## Independent test layers:

| Layer | What to challenge | What passing cannot establish |
| --- | --- | --- |
| Pure model / independent oracle | Legal actions, undo, additions, resets, all catalog witnesses, invalid dates, numeric bounds and corrupted saves | UI clarity, enjoyable difficulty, native SDK behavior |
| Production-browser tests | Actual built UI, large boards, portrait/landscape, font scaling, dark mode, repeated inputs, navigation, storage failures and conflicting tabs | Native placement, real ads, signing, R8 |
| Controlled native bridge harness | Duplicate/late callbacks, stale sessions, reward save/ack failure, pre-show timeout, view recreation | Actual SDK inventory and device integration |
| Release-payload Android emulator | Native/WebView startup, Back, rotation, state restore, bridge availability, native banner geometry | All physical devices, live dashboard delivery or guaranteed network isolation |
| Physical device / live integration | Earned credit, interstitial return, visible banner, audio focus/background and dashboard events | Exhaustive absence of defects |

Do not reuse the same algorithm as both generator and independent oracle. Re-run affected failure cases after a fix, then the appropriate regression set; repeated green broad runs do not close an untested finding. Record known failures and limitations even when an aggregate workflow is green. Diagnostic continue-on-error steps are useful for collecting evidence but must not silently make failed acceptance pass.

Exercise these interruption boundaries: before save, while save is pending, after durable save but before acknowledgement, after ack, during animation, while an ad is pending, while an ad is shown, rotation and process restart. Verify both the saved truth and the visible state after returning.

For competing tabs, change different settings nearly simultaneously while a tab is backgrounded, and concurrently perform gameplay actions. Detect stale saves and choose an explicit conflict policy. A lock with a stale in-memory merge can still lose preferences. Test with recorded reads/writes; bringing every tab to the foreground can hide the race.

Keep release acceptance tied to an explicit source run/artifact id and expected hash; a stale default can accidentally test an older APK. Mark whether emulator signing uses a temporary test identity or the actual production certificate. If claiming offline isolation, verify network blocking: removing Wi-Fi or toggling airplane mode alone may leave emulator connectivity or cached ads.

## Evidence and release bundle

Record source and build revision, commands, per-layer results, environment, APK version/size/hash/certificate, test/live mode and unresolved findings. Keep raw configuration values and private signing material out of logs and public bundles. Distinguish successful compilation, automated verification, device verification, moderation submission, approval and public availability.

Build public store assets separately: icon, representative phone/tablet screenshots, descriptions, disclosures and upload instructions. Follow the [store-media playbook](LOCALIZATION_AND_STORE_MEDIA.md). SDK declarations and storefront limits must match the current integration and current storefront requirements; copying a disclosure checklist from another app is insufficient.

## Road Lines payload verification and analytics parity

Fail closed when production signing/live configuration is missing or mismatched. Pin the public expected certificate and application/version identity; never generate a substitute production key automatically. Keep playtest appId/storage separate and explain that separation rather than claiming automatic progress migration. Keep keystore material ephemeral/private, mode0600, with success/failure cleanup. Gradle should reference environment names, not embed password values in generated text.

Verify the actual delivered APK with apksigner and SDK zipalign16KB checks, manifest identity/debuggable/orientation, exact embedded web payload, expected test/live configuration and exclusion of test adapters. Prefer official Android manifest tooling; do not extract a handwritten binary parser without independent negative fixtures. No fixed SDK version, orientation, signer or ad ID is a kit default. R8 acceptance must be proved separately on the shrunk build.

A typed TS Events interface does not establish native transport acceptance. Road Lines had24 TS events versus18 Java allowed names: six monetization/progression events and four parameter keys were silently rejected while gameplay and web analytics tests passed. Add a build contract check resolving TS aliases/intersections against the native event/key whitelist (or generate both from one schema), then verify payload types/envelopes/native entrypoint. Dashboard delivery still needs a device. SDK automatic events and unrelated custom events must not be declared broken by one custom-schema mismatch.
