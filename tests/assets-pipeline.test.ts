import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import {
  findAlphaBounds,
  prepareImageAsset,
  removeBorderBackground,
  validatePreparedImage,
} from '../src/assets/index';

const createGeneratedLikeSource = async (): Promise<Buffer> => {
  const subject = Buffer.from('<svg width="52" height="76"><rect x="2" y="2" width="48" height="72" rx="8" fill="#222"/></svg>');
  return sharp({
    create: { width: 128, height: 128, channels: 4, background: '#f4f1eb' },
  })
    .composite([{ input: subject, left: 38, top: 26 }])
    .png()
    .toBuffer();
};

describe('asset production pipeline', () => {
  it('removes only border-connected generated background and keeps the subject', async () => {
    const cutout = await removeBorderBackground(await createGeneratedLikeSource());
    const alpha = await findAlphaBounds(cutout);
    expect(alpha.transparentRatio).toBeGreaterThan(0.4);
    expect(alpha.visibleRatio).toBeGreaterThan(0.05);
    expect(alpha.bounds).not.toBeNull();
  });

  it('normalizes to a transparent WebP canvas and validates before use', async () => {
    const prepared = await prepareImageAsset(await createGeneratedLikeSource(), {
      canvas: 256,
      padding: 32,
      webpQuality: 88,
      backgroundRemoval: 'deterministic',
    });
    const validation = await validatePreparedImage(prepared.buffer, {
      canvas: 256,
      minTransparentPadding: 20,
    });
    expect(prepared.backgroundMethod).toBe('deterministic');
    expect(validation.errors).toEqual([]);
    expect(validation.alpha.bounds).not.toBeNull();
  });

  it('uses an injected AI remover only as policy requests', async () => {
    const transparent = await sharp({
      create: { width: 64, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    }).composite([{ input: Buffer.from('<svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="red"/></svg>'), left: 20, top: 20 }]).png().toBuffer();
    let calls = 0;
    const prepared = await prepareImageAsset(await createGeneratedLikeSource(), {
      canvas: 128,
      padding: 16,
      webpQuality: 85,
      backgroundRemoval: 'ai',
      aiRemoveBackground: async () => {
        calls += 1;
        return transparent;
      },
    });
    expect(calls).toBe(1);
    expect(prepared.backgroundMethod).toBe('ai');
  });
});
