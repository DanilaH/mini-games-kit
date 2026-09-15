# Hosted Yandex DRAFT validation playbook

Local CI is a prerequisite, not proof of platform behavior. The first hosted DRAFT should be treated as an evidence gate before moderation or speculative platform refactors.

Recommended order:

1. **Boot / markup:** SDK initializes; `LoadingAPI.ready()` changes only at the real usable frame; gameplay marker is stopped during startup/menu and active only in actual gameplay.
2. **Pause / audio:** startup fullscreen ad if present, Yandex pause/resume controls, tab/minimize/restore, and repeated resume with no stacked audio/tweens.
3. **Storage / recovery:** interrupt durable actions at several presentation points and verify exact once-only recovery against real Yandex storage.
4. **Content/navigation:** visit all immediately reachable content and verify there is no hidden network/decode stall that violates the project's loading contract.
5. **Ads:** rewarded grant exactly once, close-without-reward grants zero, interstitial/sticky error/no-fill behavior does not deadlock activity/audio.
6. **Localization/layout:** supported Yandex languages, desktop/mobile landscape, resize/orientation/input edge cases.
7. **Repeated use:** ordinary play long enough to expose accumulating listeners, audio, tweens, stale scene state and fatigue problems.

For diagnostics, a dedicated hosted-debug build is legitimate. It must still use the **real Yandex runtime**, not the standalone/mock runtime. Keep internal debug/economy mutation controls out of the public candidate unless that is an explicit release decision.

When benchmarking startup, compare the exact hosted candidate. Convenience hosts can have materially different CDN/routing behavior; Signal 2000 produced pathological GitHub Pages timings while the same 3.94 MiB startup-art payload completed in roughly two seconds on hosted Yandex DRAFT. That evidence is why target-host validation is part of the method, not an optional final polish step.
