import Phaser from 'phaser';

const FILTER_NODE = 'MiniGamesKitPlanarDepth';
const DEFAULT_MAX_SUPERSAMPLE = 3;

const FRAGMENT_SHADER = [
  '#pragma phaserTemplate(shaderName)',
  'precision mediump float;',
  'uniform sampler2D uMainSampler;',
  'uniform vec3 invH0;',
  'uniform vec3 invH1;',
  'uniform vec3 invH2;',
  'uniform float poseYaw;',
  'uniform float posePitch;',
  'uniform float sheenStrength;',
  'uniform float rimStrength;',
  'uniform float outlineStrength;',
  'uniform vec3 materialTint;',
  'uniform vec2 texelSize;',
  'uniform float sheenInnerWidth;',
  'uniform float sheenOuterWidth;',
  'uniform float sheenMotionBase;',
  'uniform float sheenMotionGain;',
  'uniform float rimNearBase;',
  'uniform float rimNearGain;',
  'varying vec2 outTexCoord;',
  '#pragma phaserTemplate(fragmentHeader)',
  'void main()',
  '{',
  '    vec3 p = vec3(outTexCoord, 1.0);',
  '    float w = dot(invH2, p);',
  '    float safeW = abs(w) < 0.00001 ? (w < 0.0 ? -0.00001 : 0.00001) : w;',
  '    vec2 uv = vec2(dot(invH0, p), dot(invH1, p)) / safeW;',
  '',
  '    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)',
  '    {',
  '        gl_FragColor = vec4(0.0);',
  '    }',
  '    else',
  '    {',
  '        vec4 sampled = texture2D(uMainSampler, uv);',
  '        float motion = clamp(length(vec2(poseYaw, posePitch)), 0.0, 1.0);',
  '        float sheenCoord = uv.x * 0.72 + uv.y * 0.28;',
  '        float sheenCenter = 0.5 + clamp(poseYaw * 0.20 - posePitch * 0.14, -0.26, 0.26);',
  '        float sheen = 1.0 - smoothstep(sheenInnerWidth, sheenOuterWidth, abs(sheenCoord - sheenCenter));',
  '        vec2 edgeStep = texelSize * 2.0;',
  '        float alphaLeft = texture2D(uMainSampler, clamp(uv - vec2(edgeStep.x, 0.0), vec2(0.0), vec2(1.0))).a;',
  '        float alphaRight = texture2D(uMainSampler, clamp(uv + vec2(edgeStep.x, 0.0), vec2(0.0), vec2(1.0))).a;',
  '        float alphaUp = texture2D(uMainSampler, clamp(uv - vec2(0.0, edgeStep.y), vec2(0.0), vec2(1.0))).a;',
  '        float alphaDown = texture2D(uMainSampler, clamp(uv + vec2(0.0, edgeStep.y), vec2(0.0), vec2(1.0))).a;',
  '        float neighbourAlpha = max(max(alphaLeft, alphaRight), max(alphaUp, alphaDown));',
  '        float alphaDrop = max(max(sampled.a - alphaLeft, sampled.a - alphaRight), max(sampled.a - alphaUp, sampled.a - alphaDown));',
  '        float rimMask = smoothstep(0.04, 0.35, alphaDrop);',
  '        float outlineMask = smoothstep(0.04, 0.42, max(0.0, neighbourAlpha - sampled.a));',
  '        vec2 fromCenter = uv - vec2(0.5);',
  '        float nearBias = clamp(0.5 + poseYaw * fromCenter.x * 2.2 - posePitch * fromCenter.y * 2.0, 0.0, 1.0);',
  '        float alphaMask = sampled.a;',
  '        float sheenMotion = sheenMotionBase + sheenMotionGain * motion;',
  '        float rimBias = rimNearBase + rimNearGain * nearBias;',
  '        float sheenAmount = sheenStrength * sheen * sheenMotion * alphaMask;',
  '        float rimAmount = rimStrength * rimMask * rimBias * alphaMask;',
  '        float outlineAlpha = outlineStrength * outlineMask * (1.0 - sampled.a);',
  '        sampled.rgb += materialTint * (sheenAmount + rimAmount + outlineAlpha);',
  '        sampled.a = max(sampled.a, outlineAlpha);',
  '        gl_FragColor = sampled;',
  '    }',
  '}',
].join('\n');

export type HomographyRows = readonly [number[], number[], number[]];

const identityHomography = (): HomographyRows => [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

/** Builds the inverse square-to-quad homography used by the planar-depth shader. */
export const buildInverseHomography = (yaw: number, pitch: number): HomographyRows => {
  const yawSpread = yaw * 0.04;
  const pitchSpread = pitch * 0.03;
  const shiftX = yaw * 0.006;
  const shiftY = -pitch * 0.004;

  const x0 = -pitchSpread + shiftX;
  const y0 = yawSpread + shiftY;
  const x1 = 1 + pitchSpread + shiftX;
  const y1 = -yawSpread + shiftY;
  const x2 = 1 - pitchSpread + shiftX;
  const y2 = 1 + yawSpread + shiftY;
  const x3 = pitchSpread + shiftX;
  const y3 = 1 - yawSpread + shiftY;

  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const perspectiveDenominator = dx1 * dy2 - dx2 * dy1;

  let g = 0;
  let h = 0;
  if (Math.abs(perspectiveDenominator) > 1e-8) {
    g = (dx3 * dy2 - dx2 * dy3) / perspectiveDenominator;
    h = (dx1 * dy3 - dx3 * dy1) / perspectiveDenominator;
  }

  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const c = x0;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;
  const f = y0;

  const m00 = e - f * h;
  const m01 = c * h - b;
  const m02 = b * f - c * e;
  const m10 = f * g - d;
  const m11 = a - c * g;
  const m12 = c * d - a * f;
  const m20 = d * h - e * g;
  const m21 = b * g - a * h;
  const m22 = a * e - b * d;
  const determinant = a * m00 + b * m10 + c * m20;

  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-8) return identityHomography();

  const invDet = 1 / determinant;
  return [
    [m00 * invDet, m01 * invDet, m02 * invDet],
    [m10 * invDet, m11 * invDet, m12 * invDet],
    [m20 * invDet, m21 * invDet, m22 * invDet],
  ];
};

export interface PlanarDepthMaterialProfile {
  sheenStrength: number;
  rimStrength: number;
  outlineStrength: number;
  tint: readonly [number, number, number];
  /** Inner/full-strength half-width of the diagonal sheen band. */
  sheenInnerWidth?: number;
  /** Outer/falloff half-width of the diagonal sheen band. */
  sheenOuterWidth?: number;
  /** Sheen presence while the object is close to rest. */
  sheenMotionBase?: number;
  /** Additional sheen response as yaw/pitch magnitude rises. */
  sheenMotionGain?: number;
  /** Base near-edge rim multiplier. */
  rimNearBase?: number;
  /** Additional near-edge rim multiplier driven by pose. */
  rimNearGain?: number;
}

export interface ResolvedPlanarDepthMaterialProfile {
  sheenStrength: number;
  rimStrength: number;
  outlineStrength: number;
  tint: [number, number, number];
  sheenInnerWidth: number;
  sheenOuterWidth: number;
  sheenMotionBase: number;
  sheenMotionGain: number;
  rimNearBase: number;
  rimNearGain: number;
}

const clamp01 = (value: number): number => Phaser.Math.Clamp(Number.isFinite(value) ? value : 0, 0, 1);

export const resolvePlanarDepthMaterial = (
  profile: PlanarDepthMaterialProfile,
): ResolvedPlanarDepthMaterialProfile => {
  const sheenInnerWidth = Math.max(0.001, profile.sheenInnerWidth ?? 0.055);
  const sheenOuterWidth = Math.max(sheenInnerWidth + 0.001, profile.sheenOuterWidth ?? 0.18);
  return {
    sheenStrength: Math.max(0, profile.sheenStrength),
    rimStrength: Math.max(0, profile.rimStrength),
    outlineStrength: clamp01(profile.outlineStrength),
    tint: [clamp01(profile.tint[0]), clamp01(profile.tint[1]), clamp01(profile.tint[2])],
    sheenInnerWidth,
    sheenOuterWidth,
    sheenMotionBase: Math.max(0, profile.sheenMotionBase ?? 0.08),
    sheenMotionGain: Math.max(0, profile.sheenMotionGain ?? 0.92),
    rimNearBase: Math.max(0, profile.rimNearBase ?? 0.25),
    rimNearGain: Math.max(0, profile.rimNearGain ?? 0.75),
  };
};

export class PlanarDepthController extends Phaser.Filters.Controller {
  public yaw = 0;
  public pitch = 0;
  public sheenStrength = 0;
  public rimStrength = 0;
  public outlineStrength = 0;
  public materialTint: [number, number, number] = [1, 1, 1];
  public texelSize: [number, number] = [1, 1];
  public sheenInnerWidth = 0.055;
  public sheenOuterWidth = 0.18;
  public sheenMotionBase = 0.08;
  public sheenMotionGain = 0.92;
  public rimNearBase = 0.25;
  public rimNearGain = 0.75;

  public constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    super(camera, FILTER_NODE);
  }
}

class FilterPlanarDepth extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {
  public constructor(manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager) {
    super(FILTER_NODE, manager, undefined, FRAGMENT_SHADER);
  }

  public setupUniforms(controller: Phaser.Filters.Controller): void {
    const perspective = controller as PlanarDepthController;
    const projectedYaw = -perspective.yaw;
    const [invH0, invH1, invH2] = buildInverseHomography(projectedYaw, perspective.pitch);
    this.programManager.setUniform('invH0', invH0);
    this.programManager.setUniform('invH1', invH1);
    this.programManager.setUniform('invH2', invH2);
    this.programManager.setUniform('poseYaw', projectedYaw);
    this.programManager.setUniform('posePitch', perspective.pitch);
    this.programManager.setUniform('sheenStrength', perspective.sheenStrength);
    this.programManager.setUniform('rimStrength', perspective.rimStrength);
    this.programManager.setUniform('outlineStrength', perspective.outlineStrength);
    this.programManager.setUniform('materialTint', perspective.materialTint);
    this.programManager.setUniform('texelSize', perspective.texelSize);
    this.programManager.setUniform('sheenInnerWidth', perspective.sheenInnerWidth);
    this.programManager.setUniform('sheenOuterWidth', perspective.sheenOuterWidth);
    this.programManager.setUniform('sheenMotionBase', perspective.sheenMotionBase);
    this.programManager.setUniform('sheenMotionGain', perspective.sheenMotionGain);
    this.programManager.setUniform('rimNearBase', perspective.rimNearBase);
    this.programManager.setUniform('rimNearGain', perspective.rimNearGain);
  }
}

export type PlanarDepthDescendantScaler = (
  target: Phaser.GameObjects.Container,
  factor: number,
) => void;

export interface AttachPlanarDepthOptions {
  width: number;
  height: number;
  supersampleBoost?: number;
  maxSupersample?: number;
  /**
   * Optional project-specific descendant scaling strategy. The kit always applies the inverse
   * scale to the filtered parent. The default scales direct child Containers, matching the
   * production hierarchy this workaround was extracted from.
   */
  scaleDescendants?: PlanarDepthDescendantScaler;
}

const attachments = new WeakMap<Phaser.GameObjects.Container, PlanarDepthController>();

export const resolvePlanarDepthSupersample = (
  displayScale: number,
  supersampleBoost = 1,
  maxSupersample = DEFAULT_MAX_SUPERSAMPLE,
): number => Phaser.Math.Clamp(
  (Number.isFinite(displayScale) ? Math.max(1, displayScale) : 1) * Math.max(0.1, supersampleBoost),
  1,
  Math.max(1, maxSupersample),
);

const resolveFilterDisplayScale = (target: Phaser.GameObjects.Container): number => {
  const world = target.getWorldTransformMatrix().decomposeMatrix();
  return Math.max(Math.abs(world.scaleX), Math.abs(world.scaleY));
};

const scaleNestedContainers: PlanarDepthDescendantScaler = (target, factor): void => {
  for (const child of target.list) {
    if (child instanceof Phaser.GameObjects.Container) {
      child.setScale(child.scaleX * factor, child.scaleY * factor);
    }
  }
};

const supersampleFilterTargetOnce = (
  target: Phaser.GameObjects.Container,
  factor: number,
  baseWidth: number,
  baseHeight: number,
  scaleDescendants: PlanarDepthDescendantScaler,
): void => {
  if (factor <= 1.001) {
    target.setSize(baseWidth, baseHeight);
    return;
  }

  scaleDescendants(target, factor);
  target.setScale(target.scaleX / factor, target.scaleY / factor);
  target.setSize(baseWidth * factor, baseHeight * factor);
};

export const attachPlanarDepth = (
  scene: Phaser.Scene,
  target: Phaser.GameObjects.Container,
  options: AttachPlanarDepthOptions,
): PlanarDepthController | null => {
  const existing = attachments.get(target);
  if (existing) return existing;
  if (scene.game.renderer.type !== Phaser.WEBGL) return null;

  const renderer = scene.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
  if (!renderer.renderNodes.hasNode(FILTER_NODE)) {
    renderer.renderNodes.addNodeConstructor(FILTER_NODE, FilterPlanarDepth);
  }

  // Validate Phaser's filter bootstrap before mutating target/child scales. A failed
  // attachment must not leave a visually resized hierarchy behind.
  target.enableFilters();
  const camera = target.filterCamera;
  const filters = target.filters;
  if (!camera || !filters) return null;

  const supersample = resolvePlanarDepthSupersample(
    resolveFilterDisplayScale(target),
    options.supersampleBoost ?? 1,
    options.maxSupersample ?? DEFAULT_MAX_SUPERSAMPLE,
  );
  supersampleFilterTargetOnce(
    target,
    supersample,
    options.width,
    options.height,
    options.scaleDescendants ?? scaleNestedContainers,
  );

  const controller = new PlanarDepthController(camera);
  controller.texelSize = [1 / Math.max(1, target.width), 1 / Math.max(1, target.height)];
  filters.internal.add(controller);
  attachments.set(target, controller);
  target.once('destroy', () => attachments.delete(target));
  return controller;
};

export const configurePlanarDepthMaterial = (
  controller: PlanarDepthController | null,
  profile: PlanarDepthMaterialProfile,
): void => {
  if (!controller) return;
  const resolved = resolvePlanarDepthMaterial(profile);
  controller.sheenStrength = resolved.sheenStrength;
  controller.rimStrength = resolved.rimStrength;
  controller.outlineStrength = resolved.outlineStrength;
  controller.materialTint = resolved.tint;
  controller.sheenInnerWidth = resolved.sheenInnerWidth;
  controller.sheenOuterWidth = resolved.sheenOuterWidth;
  controller.sheenMotionBase = resolved.sheenMotionBase;
  controller.sheenMotionGain = resolved.sheenMotionGain;
  controller.rimNearBase = resolved.rimNearBase;
  controller.rimNearGain = resolved.rimNearGain;
};
