# Logical landscape layout

Import from `@danilah/mini-games-kit/layout`.

## What it is

Framework-independent math for fitting a fixed-height logical game surface into real landscape viewports, including ultra-wide caps, safe-area insets and compact/standard/wide breakpoints.

## Public API

```ts
const metrics = createLogicalLayoutMetrics(
  window.innerWidth,
  window.innerHeight,
  readCssSafeAreaInsets(),
  YANDEX_LANDSCAPE_LAYOUT_PROFILE,
);

const screenX = layoutX(metrics, logicalX);
const screenY = layoutY(metrics, logicalY);
```

`YANDEX_LANDSCAPE_LAYOUT_PROFILE` preserves the proven 720-high / max-2:1 setup, but `createLogicalLayoutMetrics` accepts a complete custom `LogicalLayoutProfile`; the numbers are not hardcoded as universal game design rules.

## CSS safe areas

`readCssSafeAreaInsets()` reads `--safe-area-left/right/top/bottom` by default. Variable names and pixel ratio can be overridden.

## Non-goals

The module does not position individual HUD elements or decide game-specific layout. It only provides the logical coordinate system and safe bounds.
