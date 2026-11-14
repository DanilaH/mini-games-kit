export interface OwnedDomMotionPolicy {
  /** Host policy: false cancels overlapping old effects without playing a new one. */
  enabled?: boolean;
  /** Fresh effects keep their authored start by default; replacements sample the visible state. */
  fromCurrent?: 'replace' | 'always';
  /** Presentation only. Cancelled/replaced effects never call this handler. */
  onFinish?: () => void;
}

interface OwnedEffect {
  target: Element;
  properties: ReadonlySet<string>;
  release: () => void;
}

const metadata = new Set(['offset', 'computedOffset', 'easing', 'composite']);
const cssName = (name: string): string => name.startsWith('--') ? name
  : name === 'cssFloat' ? 'float' : name === 'cssOffset' ? 'offset'
    : name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/** Own a finite set of DOM/WAAPI effects. No global listeners, preferences or game state. */
export class OwnedDomMotion {
  private readonly active = new Map<Animation, OwnedEffect>();

  public animate(
    target: Element | null,
    frames: readonly Keyframe[],
    timing: number | KeyframeEffectOptions,
    policy: OwnedDomMotionPolicy = {},
  ): Animation | null {
    if (!target) return null;
    if (frames.length < 2) throw new TypeError('OwnedDomMotion needs at least two explicit keyframes');
    if (!target.isConnected) {
      this.cancel(target);
      return null;
    }
    const view = target.ownerDocument.defaultView;
    if (!view) return null;
    // Let the browser normalize aliases/shorthands before deciding ownership.
    // An invalid replacement must not cancel the current effect.
    const effect = new view.KeyframeEffect(target, frames.map(frame => ({...frame})), timing);
    const properties = new Set(effect.getKeyframes().flatMap(frame =>
      Object.keys(frame).filter(property => !metadata.has(property)),
    ));
    if (!properties.size) return null;
    const previous: Array<[Animation, OwnedEffect]> = [];
    for (const [animation, owner] of this.active) {
      if (animation.playState === 'idle') {
        owner.release();
      } else if (owner.target === target && [...properties].some(p => owner.properties.has(p))) {
        // Include finished effects whose finish event is still queued. Only an
        // overlapping replacement suppresses their completion, not unrelated work.
        previous.push([animation, owner]);
      }
    }
    if (policy.enabled !== false && (previous.length || policy.fromCurrent === 'always')) {
      // Read once, while the old effect still owns its visible value.
      const visible = view.getComputedStyle(target);
      const start: Keyframe = {};
      for (const property of properties) start[property] = visible.getPropertyValue(cssName(property));
      const first = frames[0]!;
      effect.setKeyframes(first.offset != null && first.offset > 0
        ? [{...start, offset: 0}, ...frames.map(frame => ({...frame}))]
        : [{...first, ...start}, ...frames.slice(1).map(frame => ({...frame}))]);
    }
    for (const [animation, owner] of previous) {
      owner.release();
      animation.cancel();
    }
    if (policy.enabled === false) return null;
    const animation = new view.Animation(effect, target.ownerDocument.timeline);
    const release = () => {
      this.active.delete(animation);
      animation.removeEventListener('finish', finish);
      animation.removeEventListener('cancel', release);
    };
    const finish = () => {
      if (!this.active.has(animation)) return;
      release(); // Release before a finish handler starts the next effect.
      if (target.isConnected) policy.onFinish?.();
    };
    this.active.set(animation, {target, properties, release});
    animation.addEventListener('finish', finish);
    animation.addEventListener('cancel', release);
    try {
      animation.play();
    } catch (error) {
      release();
      animation.cancel();
      throw error;
    }
    return animation;
  }

  /** Explicit object removal/remapping; independent targets keep their effects. */
  public cancel(target: Element): void {
    for (const [animation, owner] of this.active) {
      if (owner.target !== target) continue;
      owner.release();
      animation.cancel();
    }
  }

  /** Call on navigation, background, reduced-motion change or scope teardown. Reusable afterwards. */
  public cancelAll(): void {
    for (const [animation, owner] of this.active) {
      owner.release();
      animation.cancel();
    }
  }
}
