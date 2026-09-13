# Phaser text sharpness

Import from `@danilah/mini-games-kit/phaser`.

## What it is

A Scene-scoped helper that applies the current render pixel ratio to every Phaser `Text` object as it is added, then removes its listener on Scene shutdown.

## Public API

```ts
const uninstall = installSceneTextSharpness(scene);
```

A custom pixel-ratio resolver can be passed for tests or a project-specific density cap:

```ts
installSceneTextSharpness(scene, () => 1.5);
```

## Boundary

This only sets text resolution. Canvas/game backing-store density and layout are separate concerns handled by the renderer and `@danilah/mini-games-kit/core` helpers.
