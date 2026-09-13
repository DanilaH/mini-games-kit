const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export interface NormalizedPointerVector {
  x: number;
  y: number;
}

export interface ResponsivePose {
  yaw: number;
  pitch: number;
}

export interface IdleDriftProfile {
  delayMs: number;
  rampMs: number;
  xAmplitude: number;
  yAmplitude: number;
  xPhaseMs: number;
  yPhaseMs: number;
}

export interface ParallaxState {
  x: number;
  y: number;
}

export const normalizePointerAroundViewport = (
  pointerX: number,
  pointerY: number,
  viewportWidth: number,
  viewportHeight: number,
): NormalizedPointerVector => {
  const halfWidth = Math.max(1, viewportWidth * 0.5);
  const halfHeight = Math.max(1, viewportHeight * 0.5);
  return {
    x: clamp((pointerX - halfWidth) / halfWidth, -1, 1),
    y: clamp((pointerY - halfHeight) / halfHeight, -1, 1),
  };
};

/** Frame-rate-independent exponential response factor. */
export const exponentialResponse = (deltaMs: number, responseMs: number): number => {
  if (responseMs <= 0) return 1;
  return 1 - Math.exp(-Math.max(0, deltaMs) / responseMs);
};

export const addIdleDrift = (
  input: NormalizedPointerVector,
  enabled: boolean,
  nowMs: number,
  lastMovedAtMs: number,
  profile: IdleDriftProfile,
): NormalizedPointerVector => {
  if (!enabled) return { x: input.x, y: input.y };
  const idleWeight = clamp(
    (nowMs - lastMovedAtMs - profile.delayMs) / Math.max(1, profile.rampMs),
    0,
    1,
  );
  const driftX = Math.sin(nowMs / Math.max(1, profile.xPhaseMs)) * profile.xAmplitude * idleWeight;
  const driftY = Math.cos(nowMs / Math.max(1, profile.yPhaseMs)) * profile.yAmplitude * idleWeight;
  return {
    x: clamp(input.x + driftX, -1, 1),
    y: clamp(input.y + driftY, -1, 1),
  };
};

export const stepResponsivePose = (
  current: ResponsivePose,
  input: NormalizedPointerVector,
  enabled: boolean,
  yawMax: number,
  pitchMax: number,
  deltaMs: number,
  responseMs: number,
): ResponsivePose => {
  const targetYaw = enabled ? input.x * yawMax : 0;
  const targetPitch = enabled ? -input.y * pitchMax : 0;
  const response = exponentialResponse(deltaMs, responseMs);
  let yaw = current.yaw + (targetYaw - current.yaw) * response;
  let pitch = current.pitch + (targetPitch - current.pitch) * response;
  if (Math.abs(yaw - targetYaw) < 0.001) yaw = targetYaw;
  if (Math.abs(pitch - targetPitch) < 0.001) pitch = targetPitch;
  return { yaw, pitch };
};

export const stepParallax = (
  current: ParallaxState,
  input: NormalizedPointerVector,
  enabled: boolean,
  amountX: number,
  amountY: number,
  deltaMs: number,
  responseMs: number,
): ParallaxState => {
  const response = exponentialResponse(deltaMs, responseMs);
  const targetX = enabled ? -input.x * amountX : 0;
  const targetY = enabled ? -input.y * amountY : 0;
  return {
    x: current.x + (targetX - current.x) * response,
    y: current.y + (targetY - current.y) * response,
  };
};
