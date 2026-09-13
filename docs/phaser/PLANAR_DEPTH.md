# Phaser planar depth

Import from `@danilah/mini-games-kit/phaser`.

## What it is

A Phaser 4.2.1 WebGL filter that makes flat authored art read like a shallow planar object responding to pointer-driven yaw/pitch. It combines inverse homography with explicit sheen, rim and optional silhouette-adjacent outline response.

## Public API

```ts
const controller = attachPlanarDepth(scene, heroContainer, {
  width: 520,
  height: 620,
  supersampleBoost: 1.25,
});

configurePlanarDepthMaterial(controller, {
  sheenStrength: 0.08,
  rimStrength: 0.03,
  outlineStrength: 0,
  tint: [1, 0.9, 0.7],
  sheenInnerWidth: 0.07,
  sheenOuterWidth: 0.22,
});

if (controller) {
  controller.yaw = pose.yaw;
  controller.pitch = pose.pitch;
}
```

`attachPlanarDepth()` is idempotent per target container: repeated attachment returns the existing controller instead of compounding supersampling transforms.

`buildInverseHomography()` and `resolvePlanarDepthMaterial()` are public for testing/tuning advanced consumers.

## Supersampling hierarchy contract

Phaser filters rasterize before parent/world scaling. The current proven workaround enlarges nested child `Container`s and inversely scales the filtered parent so the visual geometry stays stable while the filter receives a denser local framebuffer. For now, treat this as an explicit structural requirement: the filtered visual content should live under child containers. Keep input zones/hitboxes outside the warped hierarchy when possible.

## Non-goals

The module does not own pointer eligibility, shadows, scene orchestration, rarity policy, hitboxes or Canvas fallback. Use `@danilah/mini-games-kit/feel` to compute pose/parallax and let the game decide when the effect is active.
