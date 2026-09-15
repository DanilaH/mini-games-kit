# Runtime image format selection

Import from `@danilah/mini-games-kit/runtime-assets`. This subpath is browser-safe and does not import Sharp/Node tooling.

`probeAvifSupport()` uses a tiny embedded 1×1 AVIF image and a bounded timeout rather than user-agent sniffing.

`detectPreferredRuntimeImageFormat()` returns `avif` when the probe succeeds and `webp` otherwise. Debug query overrides are opt-in; forcing AVIF never bypasses capability detection, while forcing WebP is always safe.

```ts
const format = await detectPreferredRuntimeImageFormat({
  overrideEnabled: debugToolsEnabled,
});

const requestPath = resolveRuntimeImageRequestPath(
  'assets/item.webp',
  format,
);
```

Keep the canonical manifest/path on the fallback asset and transform only the request URL. Texture keys and logical trim metadata should not depend on the chosen codec.

The kit does not globally store the selected format. A game owns that lifecycle and must resolve it before it starts queueing format-dependent images.
