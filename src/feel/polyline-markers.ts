export interface PolylinePoint { x: number; y: number; }
export interface PolylineMarkerOptions {
  spacing: number;
  /** Arc distance from either end; defaults to half spacing. */
  endInset?: number;
  /** Omit crowded markers without restarting the downstream phase. */
  minDistance?: number;
  /** Bounds work even for pathological input. */
  maxMarkers?: number;
}
export function polylineMarkers(points: readonly PolylinePoint[], options: PolylineMarkerOptions): PolylinePoint[] {
  const { spacing, endInset = spacing / 2, minDistance = 0, maxMarkers = 4096 } = options;
  if (!Number.isFinite(spacing) || spacing <= 0 || !Number.isFinite(endInset) || endInset < 0 ||
    !Number.isFinite(minDistance) || minDistance < 0 || !Number.isSafeInteger(maxMarkers) || maxMarkers < 1 ||
    points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) throw new RangeError('Invalid polyline marker options/points');
  const segments = points.slice(1).map((b, i) => { const a = points[i]!; return { a, b, length: Math.hypot(b.x - a.x, b.y - a.y) }; });
  const total = segments.reduce((n, s) => n + s.length, 0);
  if (!Number.isFinite(total) || total / spacing > maxMarkers) throw new RangeError('Polyline marker budget exceeded');
  const out: PolylinePoint[] = [];
  let offset = 0, target = endInset;
  for (const s of segments) {
    if (!s.length) continue;
    while (target < offset + s.length && target < total - endInset) {
      const t = (target - offset) / s.length;
      const point = { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
      const previous = out.at(-1);
      if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) >= minDistance) out.push(point);
      target += spacing;
    }
    offset += s.length;
  }
  return out;
}
