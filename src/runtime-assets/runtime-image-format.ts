export type RuntimeImageFormat = 'webp' | 'avif';

const DEFAULT_AVIF_PROBE_TIMEOUT_MS = 500;
const DEFAULT_AVIF_PROBE_DATA_URI =
  'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADrbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAETAAAAKAAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBAAwAAAAAE2NvbHJuY2x4AAEADQAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAAMG1kYXQSAAoIGAAGiAhoNCAyGhlHh4Yhh5555oAAAJBAyRxhSytNj1FFTqSg';

export interface RuntimeImageProbeLike {
  onload: (() => void) | null;
  onerror: (() => void) | null;
  width: number;
  height: number;
  src: string;
}

export interface AvifSupportProbeOptions {
  createImage?: () => RuntimeImageProbeLike;
  timeoutMs?: number;
  dataUri?: string;
}

export interface RuntimeImageFormatDetectionOptions {
  search?: string;
  overrideEnabled?: boolean;
  overrideParam?: string;
  probeAvif?: () => Promise<boolean>;
}

export const parseRuntimeImageFormatOverride = (
  search: string,
  options: { enabled?: boolean; param?: string } = {},
): RuntimeImageFormat | undefined => {
  if (options.enabled === false) return undefined;
  const value = new URLSearchParams(search)
    .get(options.param ?? 'artFormat')
    ?.trim()
    .toLowerCase();
  return value === 'webp' || value === 'avif' ? value : undefined;
};

export const probeAvifSupport = async (
  options: AvifSupportProbeOptions = {},
): Promise<boolean> => {
  const createImage = options.createImage
    ?? (typeof Image === 'undefined' ? undefined : () => new Image());
  if (!createImage) return false;

  const timeoutMs = Math.max(1, options.timeoutMs ?? DEFAULT_AVIF_PROBE_TIMEOUT_MS);
  const dataUri = options.dataUri ?? DEFAULT_AVIF_PROBE_DATA_URI;

  return new Promise<boolean>((resolve) => {
    const image = createImage();
    let settled = false;
    const timeout = setTimeout(() => finish(false), timeoutMs);

    function finish(supported: boolean): void {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      resolve(supported);
    }

    image.onload = () => finish(image.width === 1 && image.height === 1);
    image.onerror = () => finish(false);
    image.src = dataUri;
  });
};

/**
 * A debug AVIF override never bypasses capability detection. Forcing WebP is safe;
 * forcing AVIF still falls back to WebP when the browser cannot decode the probe.
 */
export const resolveRuntimeImageFormat = (
  avifSupported: boolean,
  override?: RuntimeImageFormat,
): RuntimeImageFormat => {
  if (override === 'webp') return 'webp';
  return avifSupported ? 'avif' : 'webp';
};

export const detectPreferredRuntimeImageFormat = async (
  options: RuntimeImageFormatDetectionOptions = {},
): Promise<RuntimeImageFormat> => {
  const search = options.search ?? (typeof window === 'undefined' ? '' : window.location.search);
  const override = parseRuntimeImageFormatOverride(search, {
    enabled: options.overrideEnabled ?? false,
    param: options.overrideParam ?? 'artFormat',
  });
  if (override === 'webp') return 'webp';

  const avifSupported = await (options.probeAvif ?? (() => probeAvifSupport()))();
  return resolveRuntimeImageFormat(avifSupported, override);
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const resolveRuntimeImageRequestPath = (
  assetPath: string,
  format: RuntimeImageFormat,
  options: { fallbackExtension?: string; avifExtension?: string } = {},
): string => {
  if (format !== 'avif') return assetPath;
  const fallbackExtension = options.fallbackExtension ?? '.webp';
  const avifExtension = options.avifExtension ?? '.avif';
  const matcher = new RegExp(`${escapeRegExp(fallbackExtension)}(?=($|[?#]))`, 'i');
  return assetPath.replace(matcher, avifExtension);
};
