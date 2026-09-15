import {
  resolveRuntimeImageRequestPath,
  type RuntimeImageFormat,
} from '@danilah/mini-games-kit/runtime-assets';

let selectedRuntimeImageFormat: RuntimeImageFormat = 'webp';

export const setRuntimeImageFormat = (format: RuntimeImageFormat): void => {
  selectedRuntimeImageFormat = format;
};

export const getRuntimeImageFormat = (): RuntimeImageFormat => selectedRuntimeImageFormat;

/**
 * Keep manifests/canonical asset ids on the fallback WebP path and resolve the
 * actual request URL only at the loader boundary after capability detection.
 */
export const runtimeImageRequestPath = (fallbackWebpPath: string): string =>
  resolveRuntimeImageRequestPath(fallbackWebpPath, selectedRuntimeImageFormat);
