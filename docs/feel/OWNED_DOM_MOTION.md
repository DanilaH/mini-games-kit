# Owned DOM motion

`OwnedDomMotion` from `@danilah/mini-games-kit/feel` owns a scope of Web Animations
API effects. Use it when repeated DOM feedback can overwrite a newer selection,
restart from an obsolete value, or survive navigation. It is opt-in, not a UI
framework or a replacement for an already correct CSS transition.

```ts
import {OwnedDomMotion} from '@danilah/mini-games-kit/feel';

const motion = new OwnedDomMotion(); // one presentation scope
function showSelected(cell: Element) {
  // Set semantic state first. Cancellation exposes this real underlying state.
  cell.classList.add('selected');
  motion.animate(cell, [
    {backgroundColor: 'transparent'},
    {backgroundColor: 'var(--selected)'},
  ], {duration: 100, easing: 'ease-out'}, {
    enabled: foreground && !reducedMotion,
    fromCurrent: 'always',
  });
}
// The host owns when these events happen; no global listeners are installed.
function leaveScreenOrBackground() { motion.cancelAll(); }
```

## Contract

- `animate(target, frames, timing, policy?)` returns `Animation | null`. Use an
  explicit array of at least two keyframes, replace compositing and the game's
  timing. Additive/accumulating compositing is rejected before replacement: a
  computed total is not an additive contribution. Null targets
  are ignored; disconnected targets cancel their owned effects and are skipped.
- Effects on different elements or disjoint CSS properties coexist. The browser's
  `KeyframeEffect.getKeyframes()` plus CSSOM neutral-value property expansion
  normalize shorthands/aliases before ownership comparison, including pending
  `var()` shorthands. Overlap cancels the entire previous effect, including other
  properties in that indivisible effect. `transform` and individual `translate`
  remain separate CSS properties. Only effects created by this owner are owned;
  unrelated CSS transitions, other owners and native listeners are untouched.
- A replacement starts from the visible computed values, sampled once **before**
  cancellation. `fromCurrent: 'always'` also samples a fresh effect; otherwise a
  fresh effect keeps its authored start. A delayed first offset gets an explicit
  zero-offset sample. Caller keyframe arrays are never mutated.
- `enabled: false` cancels overlapping old effects and plays nothing. The host
  must already expose the truthful static state. Preferences, game locks, ads,
  visibility and lifecycle decisions stay in the application.
- Optional `onFinish` is presentation-only and fires once, while the effect is
  still owned and the target is connected. Replacement/cancellation suppress
  stale queued completion. Cleanup happens before the callback, so it may start
  a new effect safely. Native callbacks attached directly to the returned
  `Animation` are outside this guard; never use animation completion for rewards,
  saving, input acceptance or gameplay authority.
- `cancel(target)` cancels that element's owned effects. `cancelAll()` cancels the
  scope and releases listeners; both are idempotent. The owner is reusable for the
  next screen. They do not block future calls: async results still need the host's
  attempt/revision/activity guard. Call `cancelAll()` on teardown, Back/navigation,
  background and a change to reduced motion as applicable. No DOM observer or
  automatic foreground replay is installed.

Requires DOM, `KeyframeEffect`, `Animation` and the target document's timeline.
Importing the module does not read browser globals. It is not a Phaser/canvas
animator. The application owns colors, selected/hinted classes, durations, pulse
amplitude, render density, hit areas and input/index-remapping guards. This
helper neither commits inline styles nor changes the durable model.

## Provenance, deliberate changes and acceptance

Source: Seeds `dda69c667bc39257de5ff986e7c8863ac963a274`, `src/main.ts::motion()`
and its UI acceptance (`docs/ui-motion-2026-11-14.md`). The owner explicitly
requested this extraction on 14 November 2026 after reviewing the candidate.
There is one real source consumer; the generic browser fixture is an independent
contract test, **not** a second shipped game. Other games are not upgraded.

Shared: property ownership, visible-value handoff, event cleanup and guarded
completion. Seeds keeps selection reconciliation, reduced-motion/activity
policy, easing/durations, board density and its short `choose()` busy gate.
Compared with the local implementation, the shared version uses browser property
normalization (including background shorthand/longhand overlap), target-document
constructors, explicit offset-zero handoff, guarded optional completion and no
style read when a motion request is disabled. These differences are deliberate,
not a byte-for-byte copy of the whole scene.

`tests/owned-dom-motion.test.ts` checks ownership and queued completion with
deterministic doubles. `npm run test:browser` also runs
`tools/owned-dom-motion-acceptance.mjs` against real WAAPI: interpolation,
shorthands with CSS variables, independent properties, cancellation/removal,
reduced-motion host policy, validation, delayed offsets and iframe realms.
Evidence is in `.test-output/owned-dom-motion/`. Consumer adoption must pin the
actual upstream commit and rerun the real application's input/lifecycle checks.
Browser tests do not establish phone feel, accessibility certification or revenue.
