import fs from 'node:fs/promises';

import sharp from 'sharp';

import {
  trimTransparentWebp,
  validateLogicalTrimFrame,
  type LogicalTrimFrame,
  type TrimTransparentWebpOptions,
  type TrimTransparentWebpResult,
} from './runtime-images.js';

export interface CanonicalTrimTransparentWebpOptions extends TrimTransparentWebpOptions {
  existingFrame?: LogicalTrimFrame;
}

/**
 * Idempotent file-pipeline wrapper around `trimTransparentWebp`.
 *
 * If a committed physical image already matches the supplied logical trim frame,
 * the bytes are treated as canonical and are not cropped or lossy-encoded again.
 * If a source-generation step restores a full logical canvas, dimensions no
 * longer match the old frame and a fresh trim is computed.
 */
export const trimCanonicalTransparentWebp = async (
  input: Buffer | string,
  options: CanonicalTrimTransparentWebpOptions,
): Promise<TrimTransparentWebpResult> => {
  const originalBuffer = typeof input === 'string' ? await fs.readFile(input) : input;
  const existingFrame = options.existingFrame;

  if (existingFrame) {
    if (!validateLogicalTrimFrame(existingFrame)) {
      throw new Error('Invalid existing logical trim frame');
    }
    const metadata = await sharp(originalBuffer).metadata();
    if (metadata.width === existingFrame.width && metadata.height === existingFrame.height) {
      const beforePixels = existingFrame.logicalWidth * existingFrame.logicalHeight;
      const afterPixels = existingFrame.width * existingFrame.height;
      return {
        buffer: originalBuffer,
        trimmed: true,
        frame: existingFrame,
        beforeBytes: originalBuffer.length,
        afterBytes: originalBuffer.length,
        beforePixels,
        afterPixels,
        pixelSavingRatio: beforePixels === 0 ? 0 : 1 - afterPixels / beforePixels,
        encodedSavingRatio: 0,
        rgbMae: undefined,
        alphaMae: undefined,
      };
    }
  }

  return trimTransparentWebp(originalBuffer, options);
};
