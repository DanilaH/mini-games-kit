import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';

import {
  buildAvifCompanions,
  inspectRuntimeImageBudget,
  trimCanonicalTransparentWebp,
  trimTransparentWebp,
  validateAvifCompanions,
  validateLogicalTrimFrame,
} from '../src/assets/index';

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirectories.splice(0).map((directory) => fs.rm(directory, { recursive: true, force: true })));
});

const makeTransparentWebp = async (): Promise<Buffer> => {
  const subject = await sharp({
    create: { width: 40, height: 40, channels: 4, background: { r: 220, g: 80, b: 50, alpha: 1 } },
  }).png().toBuffer();
  return sharp({
    create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: subject, left: 30, top: 30 }])
    .webp({ quality: 95, alphaQuality: 100 })
    .toBuffer();
};

describe('runtime image tooling', () => {
  it('trims transparent physical pixels while preserving logical placement metadata', async () => {
    const source = await makeTransparentWebp();
    const result = await trimTransparentWebp(source, { webpQuality: 90 });
    expect(result.trimmed).toBe(true);
    expect(result.frame).toBeDefined();
    expect(validateLogicalTrimFrame(result.frame!)).toBe(true);
    expect(result.afterPixels).toBeLessThan(result.beforePixels);
    expect(result.rgbMae).toBeLessThanOrEqual(5);
    expect(result.alphaMae).toBeLessThanOrEqual(0.5);
  });

  it('keeps an already-trimmed image + logical frame canonical across repeated builds', async () => {
    const first = await trimTransparentWebp(await makeTransparentWebp(), { webpQuality: 90 });
    expect(first.frame).toBeDefined();

    const second = await trimCanonicalTransparentWebp(first.buffer, {
      webpQuality: 90,
      existingFrame: first.frame!,
    });

    expect(second.trimmed).toBe(true);
    expect(second.frame).toEqual(first.frame);
    expect(second.buffer.equals(first.buffer)).toBe(true);
    expect(second.beforePixels).toBe(10_000);
    expect(second.afterPixels).toBe(first.afterPixels);
    expect(second.encodedSavingRatio).toBe(0);
  });

  it('builds/validates AVIF companions and reports encoded plus RGBA budgets', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mini-games-kit-images-'));
    tempDirectories.push(directory);
    const input = path.join(directory, 'asset.webp');
    const output = path.join(directory, 'asset.avif');
    await fs.writeFile(input, await makeTransparentWebp());
    const assets = [{ id: 'asset', input, output, category: 'test' }];

    const build = await buildAvifCompanions(assets, { quality: () => 70, concurrency: 1 });
    expect(build.count).toBe(1);
    const validation = await validateAvifCompanions(assets, { minAggregateSavingRatio: -1 });
    expect(validation.errors).toEqual([]);

    const budget = await inspectRuntimeImageBudget([{ id: 'asset', file: input, category: 'test' }]);
    expect(budget.count).toBe(1);
    expect(budget.pixels).toBe(10_000);
    expect(budget.estimatedRgbaBytes).toBe(40_000);
    expect(budget.categories.test?.count).toBe(1);
  });
});
