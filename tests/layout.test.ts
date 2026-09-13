import { describe, expect, it } from 'vitest';

import { createLogicalLayoutMetrics } from '../src/layout/index';

describe('createLogicalLayoutMetrics', () => {
  it('caps ultra-wide logical content at the default 2:1 profile', () => {
    const metrics = createLogicalLayoutMetrics(3440, 1440);
    expect(metrics.logicalHeight).toBe(720);
    expect(metrics.logicalWidth).toBe(1440);
    expect(metrics.logicalWidth / metrics.logicalHeight).toBeLessThanOrEqual(2);
  });

  it('keeps ordinary landscape proportional', () => {
    const metrics = createLogicalLayoutMetrics(1920, 1080);
    expect(metrics.logicalWidth).toBe(1280);
    expect(metrics.offsetX).toBeCloseTo(0, 5);
  });

  it('accepts a different reusable layout profile', () => {
    const metrics = createLogicalLayoutMetrics(1600, 900, { left: 0, right: 0, top: 0, bottom: 0 }, {
      logicalHeight: 600,
      minLogicalWidth: 600,
      maxAspect: 16 / 9,
      compactMaxAspect: 1.2,
      standardMaxAspect: 1.6,
      horizontalMarginRatio: 0.04,
      horizontalMarginMin: 20,
      horizontalMarginMax: 50,
      verticalMargin: 20,
      insetPadding: 10,
    });
    expect(metrics.logicalHeight).toBe(600);
    expect(metrics.logicalWidth).toBeCloseTo(1066.666, 2);
  });
});
