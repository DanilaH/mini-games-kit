# Native banner placement geometry

## Safe-area feedback before measuring the slot

Import `resolveNativeSafeAreaCss` from `@danilah/mini-games-kit/layout`. Call with `{viewport, webView, root, safeInsets?}` in the same CSS/native spaces as placement below. It returns `{kind:'safe', insets, rect}` with conservative **whole CSS-pixel** exclusions and usable CSS rect, or `{kind:'hidden',reason:'invalid-geometry'|'no-safe-area'}`. `insets` and `rect` are CSS pixels; native input insets remain native pixels. No SDK dependency.

```ts
const safe = resolveNativeSafeAreaCss({ viewport, webView, root, safeInsets });
if (safe.kind === 'safe') {
  rootElement.style.setProperty('--native-safe-bottom', `${safe.insets.bottom}px`);
  // Apply the other exclusions as needed, coalesce remeasurement, then call
  // resolveNativeBannerPlacement with the actual measured DOM slot.
}
```

It intersects root safe bounds with the WebView and inverts the **width-based** mapping on all four edges. Do not compute bottom reserve as just `ceil(nativeBottom/scale)`: CSS viewport height may itself be rounded. Water Sort's observed 1080×2400 WebView/392×872 CSS viewport/safe-bottom 130 px requires 49 CSS px, rather than 48. The existing placement helper correctly rejected the old slot; this helper supplies corrective layout feedback. Apply exclusions once in an explicit layout coordinate contract; do not blindly add them again to CSS env safe-area insets. Hidden/disjoint areas require layout recovery, not showing outside bounds.

Inputs require finite positive sizes and nonnegative finite native exclusions; WebView offsets may be negative. Remeasure after SDK height reservation, native inset or viewport changes; no stale geometry cache. Rounding intentionally sacrifices less than one CSS pixel per edge. This does not measure a device, install observers, select a banner height, style Android navigation bars or guarantee SDK fill.

Source addition: `DanilaH/watery-water-sort@2f86c1e`, `BannerGeometry.requiredBottomInsetCss`; generalized from bottom to all edges with validation. The consumer probe checks existing Java mapping/bottom inverse against shared TypeScript fixtures. Pure geometry evidence is separate from physical-device acceptance.

## Slot placement

Import `resolveNativeBannerPlacement` and its types from `@danilah/mini-games-kit/layout`. Pure TypeScript, no Android/Capacitor/DOM dependency. This is tested geometry, **not a bundled advertising SDK adapter**.

## Contract

```ts
import { resolveNativeBannerPlacement } from '@danilah/mini-games-kit/layout';

const result = resolveNativeBannerPlacement({
  slot: { x: 0, y: 750, width: 390, height: 60 }, // CSS viewport px
  viewport: { width: 390, height: 844 },
  webView: { x: 0, y: 24, width: 780, height: 1688 }, // native px, root-relative
  root: { width: 780, height: 1736 },
  parentPadding: { left: 0, top: 24 }, // native px
  adHeight: 100, // SDK measurement in native px at the mapped width
});

if (result.kind === 'reserve') {
  // Set DOM slot height to result.heightCss; then remeasure before showing.
} else if (result.kind === 'place') {
  // Native adapter applies result.rect size and marginLeft/marginTop.
} else {
  // Hide native banner; inspect result.reason for diagnostics.
}
```

Input slot comes from getBoundingClientRect in the same coordinate space as viewport. Native WebView origin is its location on screen minus root location on screen. Uniform CSS→native scale is WebView width / CSS viewport width; do not substitute devicePixelRatio or Android density. Native density remains relevant only when calling an SDK API that asks for dp.

Map inward to whole native pixels:
- left = ceil(webView.x + slot.x × scale)
- right = floor(webView.x + (slot.x + slot.width) × scale)
- mapped width = right - left

Measure SDK height using **that same mapped width** before calling this utility. `adHeight` must describe the current orientation/width, not a previously loaded banner. Native px, CSS px and SDK dp must not be mixed. Top/bottom use the same inward rounding; SDK height rounds up, and placement is vertically centered within the slot.

Optional `safeInsets` exclude root areas on all four sides. These are actual forbidden areas; `parentPadding` only adjusts FrameLayout margins and is not itself an exclusion. Parent-relative margins can be negative if padding has already been accounted for in the physical placement.

Output:
- `hidden`: invalid/nonfinite/zero geometry, out-of-viewport slot, mapped slot outside WebView/safe root, or below explicit `minWidth` (native px). No arbitrary screen-height or orientation restriction.
- `reserve`: slot is otherwise valid but too short; returns whole CSS height accounting for edge rounding and mapped native width. Reservation is not permission to show. Re-layout may move the slot or reveal it no longer fits.
- `place`: rect fits within current slot, WebView and safe root; returns rect and margins. No clipping to hide layout defects.

## Consumer lifecycle

Observe slot resize, viewport resize, scroll, native offsets/insets and orientation. Coalesce measurements. Tag async SDK requests with a generation; discard obsolete callbacks after rotation, navigation or destruction. Never let late callbacks show a banner for an old slot. If reservation cannot fit, keep the native view hidden and change the layout; never crop the board. Tear down observers and hide/destroy the SDK view on disposal. Parent transforms, pinch zoom and visual/layout viewport differences require explicit coordinate normalization by the consumer; this function cannot discover them.

Keep the same neutral slot surface through loading/no fill. Retry timing, minimum SDK width, ad visibility during modals/background/fullscreen ads and whether to reclaim empty space are consumer policies. The helper does not load ads, choose orientation, enforce ad-network policy or guarantee touch comfort.

## Provenance and validation

Source: Sudoku Doku 0.17 native banner placement (`DokuNativePlugin.java`, `BannerPlacement.java`) and DOM slot reservation (`App.tsx`), revision `f97cc1ed1c32e7d2f438fbaea6671530b1a5fc59`.

Strengthened extraction: finite input checks, both-axis containment, explicit safe bounds, inward rounding and deterministic reservation feedback. Native source did not provide all these guarantees. Tests cover portrait, short landscape, offsets/padding, SDK height negotiation, fractional rounding, invalid geometry and both-axis containment. These TypeScript tests do not replace a real Android SDK orientation test; the source 0.17 had real demo-banner evidence, this newly extracted helper has not been wired into a native release yet.
