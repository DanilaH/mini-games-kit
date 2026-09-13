# Pointer response and planar depth

Initial extraction source: `DanilaH/cases-yg` / Signal 2000, reference revision `26598606c8b0e143c9c97961bcdd8e03fd37bc61`.

## Why this exists

Signal 2000 got a large perceived-quality gain from making its hero pouch and revealed collectible respond continuously to pointer position without introducing a 3D asset pipeline.

The reusable mechanism is split in two:

- `@danilah/mini-games-kit/feel` owns framework-independent pointer normalization, delayed idle drift, exponential pose response and parallax math;
- `@danilah/mini-games-kit/phaser` owns the Phaser 4 WebGL planar homography/material filter.

The game still decides when pointer-follow is enabled, which object is the hero, how strong each object should react, and how environment layers are composed.

## Material profile correction

The original Signal 2000 shader inferred a special broad pouch response from `sheenStrength`. That was a project-specific hidden contract and is intentionally removed here.

The generic profile exposes sheen band width, motion response and rim bias explicitly. This makes material behavior inspectable and reusable instead of encoding an object class in a numeric threshold.

For exact Signal 2000 pouch-response parity, the old effective broad-sheen behavior maps approximately to:

```ts
const basicPouch = {
  sheenStrength: 0.09 * 1.35,
  rimStrength: 0.028 * 1.18,
  outlineStrength: 0,
  tint: [0.96, 0.94, 1] as const,
  sheenInnerWidth: 0.07,
  sheenOuterWidth: 0.24,
  sheenMotionBase: 0.14,
  sheenMotionGain: 1.06,
  rimNearBase: 0.30,
  rimNearGain: 0.82,
};
```

Collectible materials can use the default response widths/motion values and keep their existing strength/tint values.

## Supersampling correction

Phaser 4 internal filters rasterize before parent/world scaling. Signal 2000 compensates by enlarging the local filtered hierarchy and inversely scaling the filtered parent.

The kit keeps that proven workaround but makes attachment idempotent: calling `attachPlanarDepth()` twice for the same container returns the same controller instead of multiplying child scales twice.

## Non-goals

This module does not own:

- input hitboxes or pointer eligibility;
- game-specific idle timing/tuning;
- shadows or art layout;
- rarity/material policy;
- scene lifecycle/orchestration;
- fallback presentation for Canvas rendering.
