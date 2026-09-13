# Image asset production pipeline

Import from `@danilah/mini-games-kit/assets` in **Node tooling only**.

`sharp` is an optional peer dependency. A project that uses this subpath must install `sharp`; browser-only consumers of the kit do not need it.

## What it is

A reusable production pipeline for AI/generated or manually supplied 2D game art. It converts source images into consistent transparent WebP canvases and fails loudly when background removal or framing looks unsafe.

The pipeline is deliberately generic: it does not know Signal 2000 collectible IDs, manifests, rarity or art direction.

## Main public API

```ts
const prepared = await prepareImageAsset(sourceBuffer, {
  canvas: 1024,
  padding: 64,
  webpQuality: 88,
  backgroundRemoval: 'auto',
  aiRemoveBackground: optionalAiRemover,
});

const validation = await validatePreparedImage(prepared.buffer, {
  canvas: 1024,
  minTransparentPadding: 24,
});
```

For a file-to-file safe path:

```ts
await prepareImageAssetFile(
  'assets-src/item.png',
  'public/assets/item.webp',
  options,
);
```

`prepareImageAssetFile()` prepares in memory, validates, and writes the final file **only if validation passes**.

## Background removal modes

- `preserve` — keep source pixels/alpha unchanged apart from normalization;
- `deterministic` — use border-connected background removal;
- `ai` — call the consumer-provided `aiRemoveBackground` function;
- `auto` — try deterministic removal first and use the injected AI remover only if deterministic safety checks reject the mask.

The kit intentionally does not bundle a particular ML model or ONNX runtime. The next project can plug in U2Net, a hosted remover or another implementation without changing the pipeline API.

## Deterministic remover

`removeBorderBackground()` estimates a bilinear background color from the four corners, flood-fills only matching pixels connected to the outer border, feathers the resulting edge and enforces minimum/maximum foreground-ratio safety bounds. This avoids the dangerous class of failure where a script silently deletes most of the object.

## Validation helpers

`findAlphaBounds()` reports visible bounds plus transparent/visible ratios.

`validatePreparedImage()` checks:

- WebP output;
- exact square canvas size;
- meaningful alpha;
- non-empty foreground;
- minimum transparent padding;
- a soft encoded-size target.

## Non-goals

The module does not choose art style, generate prompts, build atlases, define a game manifest or decide per-item visual offsets. Those remain project/tooling policy layered on top.
