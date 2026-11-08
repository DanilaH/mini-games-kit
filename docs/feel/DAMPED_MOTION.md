# Continuous damped motion

Import `stepDampedMotion`, `DampedMotion`, `DampedMotionProfile` from `@danilah/mini-games-kit/feel`.

Use for a small oscillating surface, button or reward object that receives repeated impulses. A new impulse changes velocity rather than resetting displacement or starting an unrelated phase.

```ts
const motion = { x: 0, v: 0 };
const profile = { angularFrequency: 23, damping: 5.2 }; // example game tuning, not defaults
// On a semantic contact:
motion.v += 12;
// On each active frame (seconds, not milliseconds):
stepDampedMotion(motion, deltaMs / 1000, profile);
object.y = restingY + motion.x;
```

The function mutates only `x`/`v`. `angularFrequency` is positive radians/second; `damping` is a nonnegative exponential decay per second **strictly less than** angularFrequency. Optional `force` is a constant acceleration during this step, default 0. Inputs must be finite, delta nonnegative; unsupported/overflowing calculations throw RangeError without partially changing state. Zero delta preserves state. This is an exact constant-force underdamped solution; splitting a step is equivalent within floating-point precision while force/profile stay constant. Critical/overdamped springs are deliberately unsupported.

The game owns impulse strength, amplitude/velocity limits, sleep threshold, reduced motion and lifecycle. Do not feed accumulated background time and emit all missed tactile beats on resume. Freeze or settle presentation deliberately; never make a durable action depend on settling. Reuse one state across visual phases, and clear obsolete state on Undo/navigation. This is not a fluid simulation, tween scheduler, collision solver or Phaser dependency.

Source: `DanilaH/watery-water-sort@2f86c1eaa311e2da1de11f69d5df8b11f28e6c0d`, `src/game/liquid.ts` (`stepLiquid`); original behavior introduced in f27c28b. Extraction makes tuning explicit and adds input validation. Consumer equivalence and limits are recorded in [integration](../extraction/WATER_SORT_INTEGRATION.md).
