import { expect, it } from 'vitest';
import { resolveNativeSafeAreaCss as safeArea, resolveNativeBannerPlacement as place } from '../src/layout/native-banner-placement.js';
import { stepDampedMotion } from '../src/feel/damped-motion.js';
import { ForegroundTransition } from '../examples/foreground-transition.js';
import { GameplayActivityCoordinator } from '../src/platform/activity.js';

it.each(['dismiss-first', 'resume-first'] as const)('transition waits for SDK and activity independently: %s', order => {
  const activity = new GameplayActivityCoordinator(() => {}, () => {});
  const transition = new ForegroundTransition<string, number>(), calls: number[] = [];
  const run = () => transition.tryRun('level@1', !activity.isBlocked(), value => {
    calls.push(value); run(); // A navigation callback cannot reenter the same transition.
  });
  const dispose = activity.onBlockReasonsChange(run);
  const ticket = transition.request('level@1', 2);
  activity.setBlocked('ad', true); activity.setBlocked('hidden', true); activity.setBlocked('native', true);
  if (order === 'dismiss-first') { transition.complete(ticket); activity.setBlocked('ad', false); }
  activity.setBlocked('hidden', false); activity.setBlocked('native', false);
  if (order === 'resume-first') { expect(calls).toEqual([]); transition.complete(ticket); activity.setBlocked('ad', false); }
  run(); transition.complete(ticket); run();
  expect(calls).toEqual([2]); dispose();
});
it('cancel/replacement/stale levels invalidate old SDK callbacks; failures cannot navigate twice', () => {
  const t = new ForegroundTransition<string, number>(), calls: number[] = [];
  const old = t.request('a', 1); t.cancel(); t.complete(old); expect(t.tryRun('a', true, n => calls.push(n))).toBe(false);
  const next = t.request('a', 2); t.complete(old); expect(t.tryRun('a', true, n => calls.push(n))).toBe(false);
  t.complete(next); expect(t.tryRun('b', true, n => calls.push(n))).toBe(false);
  const last = t.request('b', 3); t.complete(last);
  expect(() => t.tryRun('b', true, () => { throw Error('navigation failed'); })).toThrow();
  expect(t.tryRun('b', true, n => calls.push(n))).toBe(false); expect(calls).toEqual([]);
});
