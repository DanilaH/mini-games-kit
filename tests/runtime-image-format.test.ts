import { describe, expect, it } from 'vitest';

import {
  parseRuntimeImageFormatOverride,
  probeAvifSupport,
  resolveRuntimeImageFormat,
  resolveRuntimeImageRequestPath,
} from '../src/runtime-assets/index';

describe('runtime image format selection', () => {
  it('keeps debug overrides opt-in and never forces unsupported AVIF', () => {
    expect(parseRuntimeImageFormatOverride('?artFormat=avif', { enabled: false })).toBeUndefined();
    expect(parseRuntimeImageFormatOverride('?artFormat=webp', { enabled: true })).toBe('webp');
    expect(resolveRuntimeImageFormat(false, 'avif')).toBe('webp');
    expect(resolveRuntimeImageFormat(true, 'avif')).toBe('avif');
  });

  it('rewrites only the fallback extension and preserves query/hash suffixes', () => {
    expect(resolveRuntimeImageRequestPath('assets/a.webp?run=1#x', 'avif'))
      .toBe('assets/a.avif?run=1#x');
    expect(resolveRuntimeImageRequestPath('assets/a.webp', 'webp')).toBe('assets/a.webp');
  });

  it('probes actual decode capability through the injected image object', async () => {
    const image = { onload: null, onerror: null, width: 0, height: 0, src: '' } as {
      onload: (() => void) | null;
      onerror: (() => void) | null;
      width: number;
      height: number;
      src: string;
    };
    const pending = probeAvifSupport({ createImage: () => image, timeoutMs: 1000 });
    image.width = 1;
    image.height = 1;
    image.onload?.();
    await expect(pending).resolves.toBe(true);
  });
});
