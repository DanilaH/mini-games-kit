# Markers along a polyline

Import `polylineMarkers` from `@danilah/mini-games-kit/feel`. Pure math, no renderer dependency.

```ts
const dots = polylineMarkers(points, {
  spacing: 9, minDistance: 3.6, endInset: 4.5, maxMarkers: 4096,
});
```

Returns `{x,y}[]` along a single arc-length phase. Unlike restarting dots per segment, turns do not double the pattern. `minDistance` omits a crowded candidate relative to the preceding emitted marker without moving later candidates; this is a local corner-clearance rule, not a global collision solver. Euclidean gaps at bends are not promised equal. Zero-length segments are ignored. Empty/single-point paths return no markers.

Defaults: endInset=spacing/2, minDistance=0, maxMarkers=4096. Nonfinite coordinates, nonpositive spacing, negative/nonfinite offsets, invalid budgets, overflow or total-length/spacing exceeding the budget throw RangeError before iteration. This explicit bound is a semantic strengthening of Road Lines' helper. Caller owns rendering, scale and input size; the helper does not know cells, puzzle legality or start/finish art.
