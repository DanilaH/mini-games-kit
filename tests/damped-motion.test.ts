import { expect, it } from 'vitest';
import { resolveNativeSafeAreaCss as safeArea, resolveNativeBannerPlacement as place } from '../src/layout/native-banner-placement.js';
import { stepDampedMotion } from '../src/feel/damped-motion.js';
import { ForegroundTransition } from '../examples/foreground-transition.js';
import { GameplayActivityCoordinator } from '../src/platform/activity.js';

const profile = { angularFrequency: 23, damping: 5.2 };
it.each([30, 60, 120])('motion preserves phase at %dHz and with a constant force', hz => {
  for (const force of [0, 11]) {
    const whole = { x: 2, v: -9 }, sliced = { ...whole };
    stepDampedMotion(whole, 1, { ...profile, force });
    for (let i = 0; i < hz; i++) stepDampedMotion(sliced, 1 / hz, { ...profile, force });
    expect(sliced.x).toBeCloseTo(whole.x, 11); expect(sliced.v).toBeCloseTo(whole.v, 10);
  }
});
it('new impulse preserves displacement and motion converges to constant-force equilibrium', () => {
  const state = { x: 3, v: 0 }; stepDampedMotion(state, .05, profile);
  const x = state.x; state.v += 20; expect(state.x).toBe(x);
  stepDampedMotion(state, 0, profile); expect(state.x).toBe(x);
  stepDampedMotion(state, 20, { ...profile, force: 529 });
  expect(state.x).toBeCloseTo(1, 10); expect(state.v).toBeCloseTo(0, 10);
});
it('invalid motion input cannot partially change the state', () => {
  const state = { x: 2, v: 3 };
  for (const damping of [-1, 23, Infinity]) expect(() => stepDampedMotion(state, 1, { ...profile, damping })).toThrow();
  expect(() => stepDampedMotion(state, -1, profile)).toThrow();
  expect(state).toEqual({ x: 2, v: 3 });
});

