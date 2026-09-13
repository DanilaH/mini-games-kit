# Phaser runtime image loader

Import from `@danilah/mini-games-kit/phaser`.

## What it is

A safe helper for lazy-loading reviewed image textures after a Phaser Scene is already active.

## Public API

```ts
await ensureRuntimeImageTextures(scene, [
  { textureKey: 'skin-1', assetPath: '/assets/skin-1.webp' },
  { textureKey: 'skin-2', assetPath: '/assets/skin-2.webp' },
], 'skin art');
```

Already-present texture keys are skipped. Loader errors are collected only for files requested by this call.

## Lifecycle behavior

If the Scene shuts down while loading, the Promise resolves and listeners detach so stale async work does not retain the dead Scene. Failed textures stay absent from the Texture Manager, which makes a later retry possible.

## Non-goals

The helper does not define manifests, preload strategy, fallback art or asset versioning.
