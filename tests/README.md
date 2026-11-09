# Verification map

Tests are named after capabilities, not donor games. Run all portable tests with `npm test`, or select a file with `npx vitest run tests/<capability>.test.ts`.

| Layer | Entry | Proves |
| --- | --- | --- |
| Portable contracts | `tests/*.test.ts` | Pure behavior, controlled storage/SDK failure sequences |
| Browser acceptance | `tools/browser-acceptance.mjs` | Real touch/keyboard, WebAudio and active/sleeping Phaser teardown |
| Generated project | `tools/bootstrap/smoke-yandex-phaser.mjs` | Packed dependency installation, generated typecheck/test/build/upload audit |
| Source consumers | `tools/*consumer-probe.mjs` | Temporary adapters against a particular source revision |

`stability.test.ts` contains cross-module regression cases from the repository audit. `receipt-snapshot-integration.test.ts` covers coordinated writers; it does not claim multi-device atomicity.

`daily-streak.test.ts`, `hint-budget.test.ts` and `tier-progress.test.ts` cover portable progression models. `daily-progression-integration.test.ts` exercises the pure whole-snapshot example through reload/repeat/archive flows; it does not simulate a storage transaction or native SDK. Android reminders/review/haptics acceptance lives in focused integration recipes and still requires consumer/device verification.

The old Road Lines browser command remains a compatibility entry point for existing probes. Historical validation JSON is a dated record, not a current test result. Unit/browser success does not replace hosted SDK, physical-device or signed-release acceptance.
