export interface DampedMotion { x: number; v: number }
export interface DampedMotionProfile {
  /** Radians/second; positive. */
  angularFrequency: number;
  /** Exponential decay / second, in [0, angularFrequency). Underdamped only. */
  damping: number;
  /** Constant acceleration during this step. Default 0. */
  force?: number;
}

/** Exact constant-force underdamped step. Impulses modify v, preserving displacement.
 * No clock, scheduler, clamps, sleep threshold or game-owned side effects.
 */
export function stepDampedMotion(state: DampedMotion, deltaSeconds: number, profile: DampedMotionProfile): void {
  const { angularFrequency: omega, damping: decay, force = 0 } = profile;
  if (![state.x, state.v, deltaSeconds, omega, decay, force].every(Number.isFinite) ||
    deltaSeconds < 0 || omega <= 0 || decay < 0 || decay >= omega || !Number.isFinite(omega * omega)) {
    throw new RangeError('Expected finite underdamped motion and nonnegative deltaSeconds');
  }
  if (deltaSeconds === 0) return;
  const damped = Math.sqrt((omega - decay) * (omega + decay));
  const equilibrium = force / (omega * omega), x = state.x - equilibrium;
  const b = (state.v + decay * x) / damped;
  const e = Math.exp(-decay * deltaSeconds), angle = damped * deltaSeconds;
  const c = Math.cos(angle), s = Math.sin(angle);
  const nextX = equilibrium + e * (x * c + b * s);
  const nextV = e * ((-decay * x + b * damped) * c + (-decay * b - x * damped) * s);
  if (![nextX, nextV].every(Number.isFinite)) throw new RangeError('Motion exceeds finite numeric range');
  state.x = nextX; state.v = nextV;
}
