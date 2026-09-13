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

`attachPlanarDepth()` is idempotent per target container: repeated attachment returns the existing controller instead of compounding supersampling transforms. It also validates that Phaser actually created the filter camera/list before changing target or descendant scales, so an unsupported/failed attachment does not leave the visual hierarchy resized.

`buildInverseHomography()`, `resolvePlanarDepthMaterial()` and `resolvePlanarDepthSupersample()` are public for testing/tuning advanced consumers.

## Supersampling hierarchy contract

Phaser filters rasterize before parent/world scaling. The proven workaround enlarges the filtered visual hierarchy and inversely scales the filtered parent so the on-screen geometry stays stable while the filter receives a denser local framebuffer.

By default the kit scales direct child `Container`s, matching the production hierarchy the workaround was extracted from. If a game uses a different hierarchy, provide `scaleDescendants(target, factor)`:

```ts
attachPlanarDepth(scene, target, {
  width: 480,
  height: 480,
  scaleDescendants: (container, factor) => {
    for (const child of container.list) {
      if ('setScale' in child && typeof child.setScale === 'function') {
        child.setScale(child.scaleX * factor, child.scaleY * factor);
      }
    }
  },
});
```

The callback should scale only visual descendants that must compensate for the inverse parent scale. Keep input zones/hitboxes outside the warped hierarchy when possible.

## Non-goals

The module does not own pointer eligibility, shadows, scene orchestration, rarity policy, hitboxes or Canvas fallback. Use `@danilah/mini-games-kit/feel` to compute pose/parallax and let the game decide when the effect is active.
