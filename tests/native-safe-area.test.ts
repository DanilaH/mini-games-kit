import { expect, it } from 'vitest';
import { resolveNativeSafeAreaCss as safeArea, resolveNativeBannerPlacement as place } from '../src/layout/native-banner-placement.js';
import { stepDampedMotion } from '../src/feel/damped-motion.js';
import { ForegroundTransition } from '../examples/foreground-transition.js';
import { GameplayActivityCoordinator } from '../src/platform/activity.js';

it('repairs the observed rounded CSS viewport: 48px excludes too little, 49px fits', () => {
  const input = { viewport: { width: 392, height: 872 }, webView: { x: 0, y: 0, width: 1080, height: 2400 },
    root: { width: 1080, height: 2400 }, safeInsets: { left: 0, top: 94, right: 0, bottom: 130 } };
  expect(Math.ceil(130 / (1080 / 392))).toBe(48);
  const area = safeArea(input); expect(area.kind).toBe('safe');
  if (area.kind !== 'safe') throw Error('safe area');
  expect(area.insets.bottom).toBe(49);
  const slot = { x: 12, y: 764.7, width: 368.7, height: 60 };
  expect(place({ ...input, slot, adHeight: 150 })).toEqual({ kind: 'hidden', reason: 'outside-root' });
  expect(place({ ...input, slot: { ...slot, y: slot.y - 1 }, adHeight: 150 }).kind).toBe('place');
});

it.each([
  [360, 800, 720, 1600, 0, 1600, 48], [393, 852, 1080, 2340, 0, 2340, 72],
  [412, 915, 1440, 3200, 0, 3200, 168], [360, 704, 720, 1600, 48, 1408, 144],
  [480, 880, 1200, 2400, 75, 2200, 120],
])('reserves a fitting bottom slot across native/CSS sizes %j', (vw, vh, width, rootHeight, top, height, bottom) => {
  const input = { viewport: { width: vw, height: vh }, webView: { x: 0, y: top, width, height },
    root: { width, height: rootHeight }, safeInsets: { left: 0, top: 0, right: 0, bottom } };
  const area = safeArea(input); if (area.kind !== 'safe') throw Error('safe area');
  const result = place({ ...input, slot: { x: 12, y: vh - area.insets.bottom - 60, width: vw - 24, height: 60 }, adHeight: 60 });
  expect(result.kind).toBe('place');
  if (result.kind === 'place') expect(result.rect.y + result.rect.height).toBeLessThanOrEqual(Math.min(top + height, rootHeight - bottom));
});

it('projects all four edges through offsets and rejects disjoint or invalid safe areas', () => {
  const input = { viewport: { width: 100, height: 100 }, webView: { x: -5, y: 8, width: 250, height: 250 },
    root: { width: 240, height: 240 }, safeInsets: { left: 10, top: 20, right: 20, bottom: 30 } };
  expect(safeArea(input)).toEqual({ kind: 'safe', insets: { left: 6, top: 5, right: 10, bottom: 20 }, rect: { x: 6, y: 5, width: 84, height: 75 } });
  const area = safeArea(input); if (area.kind !== 'safe') throw Error('safe area');
  expect(place({ ...input, slot: area.rect, adHeight: 30 }).kind).toBe('place');
  expect(safeArea({ ...input, safeInsets: { left: 240, top: 0, right: 0, bottom: 0 } }).kind).toBe('hidden');
  expect(safeArea({ ...input, viewport: { width: NaN, height: 100 } })).toEqual({ kind: 'hidden', reason: 'invalid-geometry' });
  expect(safeArea({ ...input, safeInsets: { left: 0, top: -1, right: 0, bottom: 0 } }).kind).toBe('hidden');
});

