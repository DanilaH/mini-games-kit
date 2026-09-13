import { describe, expect, it } from 'vitest';

import {
  addIdleDrift,
  exponentialResponse,
  normalizePointerAroundViewport,
  stepParallax,
  stepResponsivePose,
} from '../src/feel/pointer-response';

describe('pointer response feel', () => {
  it('normalizes viewport pointer coordinates to a bounded -1..1 vector', () => {
    expect(normalizePointerAroundViewport(450, 360, 900, 720)).toEqual({ x: 0, y: 0 });
    expect(normalizePointerAroundViewport(900, 0, 900, 720)).toEqual({ x: 1, y: -1 });
    expect(normalizePointerAroundViewport(1200, 900, 900, 720)).toEqual({ x: 1, y: 1 });
  });

  it('uses frame-rate-independent exponential smoothing', () => {
    const oneFrame = exponentialResponse(16.6, 105);
    const twoFrames = 1 - (1 - oneFrame) * (1 - oneFrame);
    expect(exponentialResponse(33.2, 105)).toBeCloseTo(twoFrames, 8);
    expect(exponentialResponse(16, 0)).toBe(1);
  });

  it('ramps idle drift only after the configured quiet period', () => {
    const profile = {
      delayMs: 1800,
      rampMs: 1200,
      xAmplitude: 0.085,
      yAmplitude: 0.055,
      xPhaseMs: 3180,
      yPhaseMs: 4170,
    };
    const input = { x: 0.2, y: -0.1 };

    expect(addIdleDrift(input, true, 1700, 0, profile)).toEqual(input);
    const drifting = addIdleDrift(input, true, 3600, 0, profile);
    expect(drifting.x).not.toBe(input.x);
    expect(drifting.y).not.toBe(input.y);
    expect(drifting.x).toBeGreaterThanOrEqual(-1);
    expect(drifting.x).toBeLessThanOrEqual(1);
    expect(addIdleDrift(input, false, 10000, 0, profile)).toEqual(input);
  });

  it('maps the shared input vector to object-specific yaw/pitch and returns smoothly to rest', () => {
    const moved = stepResponsivePose(
      { yaw: 0, pitch: 0 },
      { x: 0.8, y: -0.5 },
      true,
      1,
      0.65,
      16.6,
      105,
    );
    expect(moved.yaw).toBeGreaterThan(0);
    expect(moved.pitch).toBeGreaterThan(0);
    expect(moved.yaw).toBeLessThan(0.8);
    expect(moved.pitch).toBeLessThan(0.325);

    const resting = stepResponsivePose(moved, { x: 0.8, y: -0.5 }, false, 1, 0.65, 16.6, 105);
    expect(Math.abs(resting.yaw)).toBeLessThan(Math.abs(moved.yaw));
    expect(Math.abs(resting.pitch)).toBeLessThan(Math.abs(moved.pitch));
  });

  it('lets background layers share input but use different parallax depth', () => {
    const background = stepParallax({ x: 0, y: 0 }, { x: 1, y: 0.5 }, true, 1.8, 1.1, 180, 180);
    const ambient = stepParallax({ x: 0, y: 0 }, { x: 1, y: 0.5 }, true, 4.6, 2.8, 180, 180);

    expect(Math.abs(ambient.x)).toBeGreaterThan(Math.abs(background.x));
    expect(Math.abs(ambient.y)).toBeGreaterThan(Math.abs(background.y));
  });
});
