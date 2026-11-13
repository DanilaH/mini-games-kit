# Project agent contract — Yandex Games + Phaser

**mini-games-kit pinned commit:** __MINI_GAMES_KIT_REF__

## Before implementing a material task

1. Read BOOTSTRAP.md, docs/PROJECT_DECISIONS.md, docs/ASSET_POLICY.md, docs/RELEASE_CHECKLIST.md and inspect the actual current game source and most recent approved product decisions.
2. Open **docs/kit-guidance/TASK_ROUTER.md** (generated with this project) and select 1–2 relevant **pinned** research/playbook routes. For any UI change, select its UI route before implementation, reuse the approved project components/tokens and verify affected states without waiting for an owner reminder. A small fix only needs its relevant section. Do not blindly apply all topics or produce a new director for a local UX fix.
3. If the task cites a reference game, original video, GIF, screenshot or «as in the original», follow **docs/kit-guidance/REFERENCE_PROTOCOL.md** before coding. Record OBSERVED vs INFERRED vs NOT INSPECTED; compare actual input/state transitions and feel, not only appearance.
4. Before any reusable mechanism, inspect the pinned [kit API](https://github.com/DanilaH/mini-games-kit/blob/__MINI_GAMES_KIT_REF__/docs/API.md). Reuse existing suitable primitives rather than copying code. Do not silently upgrade the dependency.
5. Make the smallest evidence-backed change; verify actual gameplay, state/save, responsive input, SDK lifecycle and build under the cases changed. For substantial UI work show the applied rule, affected state and comparable screen/transition evidence, including intentional exceptions. Simulation/CI is not phone performance, human pleasure or live revenue evidence.
6. At the end of substantial work explicitly report **KIT IMPACT: NONE / REUSE / IMPROVE / CANDIDATE / EXTRACTED** with the evidence described in docs/kit-guidance/KIT_FEEDBACK_LOOP.md. Raise candidate upstream changes before keeping a second divergent copy.

## Yandex baseline is binding

The generated baseline owns:
- real/mock host separation and correct LoadingAPI.ready only after the first meaningful presentable frame;
- GameplayAPI pause/resume, visibility/ad/orientation blockers, sound activity and startup failure/preload handling;
- mobile viewport/orientation, strict TypeScript, CI, real Yandex upload-root audit, project-specific asset policy.

These contracts are not disposable. Replacing any baseline mechanism requires recording the old behavior, why it fails this game, replacement and focused evidence in docs/PROJECT_DECISIONS.md. Do not import Android Yandex Mobile Ads SDK into Yandex Games web or vice versa.

## Game-specific decisions, owner consent and evidence

Core gameplay, RNG, progression, economy, content, save schema, audio/art identity, exact asset dimensions, loader policy, meta, Yandex ad boundaries and player-facing style belong to **this game**, not the kit. Preserve saved progress and deterministic replay.

For a new visual identity, first use the **Visual Preproduction** route: compare genuinely different concepts on identical real gameplay states and obtain owner approval before mass art. For real store submission use the **Store Presence** route with authentic assets and current host policy; get owner approval before publish, paid outreach or store updates. Do not delay a throwaway mechanics prototype for illustrative art.

A verified user bug can be repaired locally without requesting approval for an unrelated design choice. Do not claim inspected video/phone/analytics if the evidence was not available. No mandatory cross-promo, universal analytics, onboarding engine or retention director.

## Local anchors

- Task route: docs/kit-guidance/TASK_ROUTER.md
- Reference analysis: docs/kit-guidance/REFERENCE_PROTOCOL.md
- Kit reusable improvement/extraction: docs/kit-guidance/KIT_FEEDBACK_LOOP.md
- Current game truth and selected kit imports: docs/PROJECT_DECISIONS.md
- Actual build/test commands: README.md and BOOTSTRAP.md
