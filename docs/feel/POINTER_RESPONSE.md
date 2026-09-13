# Pointer response helpers

Import from `@danilah/mini-games-kit/feel`.

## What it is

Framework-independent math for a lightweight responsive hero/environment layer: viewport-normalized pointer position, delayed idle drift, frame-rate-independent pose smoothing and parallax.

## Public API

```ts
const pointer = normalizePointerAroundViewport(x, y, width, height);
const withIdle = addIdleDrift(pointer, true, now, lastMovedAt, idleProfile);
const pose = stepResponsivePose(currentPose, withIdle, true, 1, 0.65, deltaMs, 105);
const background = stepParallax(currentBackground, withIdle, true, 2, 1.2, deltaMs, 180);
```

`exponentialResponse(deltaMs, responseMs)` is also exported when a consumer needs the same smoothing factor for another property.

## Intended use

The game decides **when** pointer-follow is allowed and how strongly each layer reacts. A common pattern is: hero gets stronger response, background gets small inverse parallax, ambient foreground particles get a little more.

## Non-goals

No DOM/Phaser listeners are installed. The module does not infer device type, hover support or gameplay phase. Those eligibility decisions remain project policy.
