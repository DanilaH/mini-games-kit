import { resolveRenderPixelRatio } from '../core/render-density.js';

export type LayoutMode = 'compact' | 'standard' | 'wide';

export interface SafeAreaInsets {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface LogicalLayoutProfile {
  logicalHeight: number;
  minLogicalWidth: number;
  maxAspect: number;
  compactMaxAspect: number;
  standardMaxAspect: number;
  horizontalMarginRatio: number;
  horizontalMarginMin: number;
  horizontalMarginMax: number;
  verticalMargin: number;
  insetPadding: number;
}

export interface LayoutMetrics {
  viewportWidth: number;
  viewportHeight: number;
  logicalWidth: number;
  logicalHeight: number;
  scale: number;
  offsetX: number;
  mode: LayoutMode;
  centerX: number;
  centerY: number;
  safeLeft: number;
  safeRight: number;
  safeTop: number;
  safeBottom: number;
}

export const ZERO_SAFE_AREA: Readonly<SafeAreaInsets> = { left: 0, right: 0, top: 0, bottom: 0 };

export const YANDEX_LANDSCAPE_LAYOUT_PROFILE: Readonly<LogicalLayoutProfile> = {
  logicalHeight: 720,
  minLogicalWidth: 900,
  maxAspect: 2,
  compactMaxAspect: 1.5,
  standardMaxAspect: 1.95,
  horizontalMarginRatio: 0.04,
  horizontalMarginMin: 28,
  horizontalMarginMax: 64,
  verticalMargin: 28,
  insetPadding: 16,
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const readCssPixels = (styles: CSSStyleDeclaration, name: string): number => {
  const parsed = Number.parseFloat(styles.getPropertyValue(name));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export interface CssSafeAreaOptions {
  pixelRatio?: number;
  leftVariable?: string;
  rightVariable?: string;
  topVariable?: string;
  bottomVariable?: string;
}

export const readCssSafeAreaInsets = (options: CssSafeAreaOptions = {}): SafeAreaInsets => {
  if (typeof document === 'undefined') return { ...ZERO_SAFE_AREA };
  const styles = window.getComputedStyle(document.documentElement);
  const ratio = resolveRenderPixelRatio(options.pixelRatio ?? 1, Math.max(1, options.pixelRatio ?? 1));
  return {
    left: readCssPixels(styles, options.leftVariable ?? '--safe-area-left') * ratio,
    right: readCssPixels(styles, options.rightVariable ?? '--safe-area-right') * ratio,
    top: readCssPixels(styles, options.topVariable ?? '--safe-area-top') * ratio,
    bottom: readCssPixels(styles, options.bottomVariable ?? '--safe-area-bottom') * ratio,
  };
};

export const createLogicalLayoutMetrics = (
  viewportWidth: number,
  viewportHeight: number,
  safeArea: SafeAreaInsets = ZERO_SAFE_AREA,
  profile: Readonly<LogicalLayoutProfile> = YANDEX_LANDSCAPE_LAYOUT_PROFILE,
): LayoutMetrics => {
  const width = Math.max(1, viewportWidth);
  const height = Math.max(1, viewportHeight);
  const logicalHeight = Math.max(1, profile.logicalHeight);
  const aspect = width / height;
  const scale = height / logicalHeight;
  const logicalWidth = clamp(
    aspect * logicalHeight,
    Math.max(1, profile.minLogicalWidth),
    logicalHeight * Math.max(1, profile.maxAspect),
  );
  const contentWidth = logicalWidth * scale;
  const offsetX = (width - contentWidth) / 2;
  const mode: LayoutMode = aspect <= profile.compactMaxAspect
    ? 'compact'
    : aspect <= profile.standardMaxAspect
      ? 'standard'
      : 'wide';
  const horizontalMargin = clamp(
    logicalWidth * profile.horizontalMarginRatio,
    profile.horizontalMarginMin,
    profile.horizontalMarginMax,
  );
  const safeViewportLeft = Math.max(0, safeArea.left - offsetX) / scale;
  const safeViewportRight = (width - safeArea.right - offsetX) / scale;

  return {
    viewportWidth: width,
    viewportHeight: height,
    logicalWidth,
    logicalHeight,
    scale,
    offsetX,
    mode,
    centerX: logicalWidth / 2,
    centerY: logicalHeight / 2,
    safeLeft: Math.max(horizontalMargin, safeViewportLeft + profile.insetPadding),
    safeRight: Math.min(logicalWidth - horizontalMargin, safeViewportRight - profile.insetPadding),
    safeTop: Math.max(profile.verticalMargin, safeArea.top / scale + profile.insetPadding),
    safeBottom: Math.min(
      logicalHeight - profile.verticalMargin,
      logicalHeight - safeArea.bottom / scale - profile.insetPadding,
    ),
  };
};

export const layoutX = (metrics: LayoutMetrics, logicalX: number): number =>
  metrics.offsetX + logicalX * metrics.scale;

export const layoutY = (metrics: LayoutMetrics, logicalY: number): number =>
  logicalY * metrics.scale;
