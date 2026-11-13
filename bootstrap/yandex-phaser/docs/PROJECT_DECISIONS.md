# Project decisions

Fill this document as product/technical decisions become real. Bootstrap defaults are infrastructure, not evidence for game-specific policy.

## Product loop and state truth

- Core loop:
- Durable progression:
- Presentation-only state:
- RNG boundary:

## Startup and loading

- First semantic presentable frame:
- Startup-required assets:
- Session-required assets:
- Deferred/loading boundaries:
- Post-ready network/decode policy:

## Layout and devices

- Supported orientation(s): landscape by bootstrap default; change only intentionally.
- Logical layout profile:
- DPR/render-density cap:
- Target device/browser acceptance set:

## UI profile

Record the accepted UI profile alongside the layout choices: existing components/tokens,
main actions and states, motion for frequent input versus rewards, cancellation/reduced
motion and comparable screen/transition evidence. Link an existing Art Bible/style
source instead of duplicating it. UI values belong to this game, not the kit.

## Persistence and recovery

- Save schema/version:
- Repairable transient fields:
- Invalid-state policy:
- Ambiguous-write/reward recovery:

## Monetization and lifecycle

- Interstitial boundaries:
- Rewarded-ad ownership semantics:
- Pause/resume/audio behavior:

## Onboarding

- Semantic events that advance onboarding:
- One-time durable grants:
- Recovery/re-entry behavior:

## Visual direction (before mass art / UI production)

- Primary gameplay emotion and UX priority:
- Compared visual concepts / mockup links (same game states):
- Selected setting depth and rationale (including NONE):
- Mascot / no-mascot choice, role and exclusion from active field:
- Art pillars, palette/material/typography and asset style envelope:
- Icon/store identity and authentic gameplay presentation:
- Production budget / maintenance risk:
- Owner approval and Art Bible link:
- Visual approval status: UNDECIDED / APPROVED / HOLD:

## Research and reference selection — only when task requires it

- Active question/observed defect, affected scene and baseline SHA:
- Selected **one or two** Task Router routes and actual pinned documents read:
- SELECT / HOLD / REJECT decision and minimal test:
- If a reference exists: URL/file/timecode/device/version, OBSERVED vs INFERRED vs NOT INSPECTED, interaction gap, original assets excluded:
- Human feel vs independent browser/CI evidence (do not conflate):

## Kit adoption and feedback

| Task / capability | Pinned kit API or documentation | REUSE / PROJECT POLICY / NOT APPLICABLE / MISSING | Tests / reason |
| --- | --- | --- | --- |
| | | | |

- Source kit commit, deliberate upgrade or private wrapper:
- Existing kit primitive improved? Exact bug/reproducer and upstream proposal:
- New local reusable primitive candidate? Second real consumer evidence or HOLD:
- Last substantial change KIT IMPACT: NONE / REUSE / IMPROVE / CANDIDATE / EXTRACTED:
- Upstream PR / owner decision, if actually created:

## Intentional bootstrap deviations

For every removed/replaced baseline mechanism, record the old contract, replacement, reason and validation evidence.
