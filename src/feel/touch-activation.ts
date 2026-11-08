export interface TouchActivationOptions {
  resolveButton(target: EventTarget | null): HTMLButtonElement | null;
  movementTolerance?: number;
  compatibilityWindowMs?: number;
}
/** Opt-in for docks affected by captured gameplay gestures. Never install twice on the same dock. */
export function installTouchActivation(root: HTMLElement, options: TouchActivationOptions): () => void {
  const { resolveButton, movementTolerance = 12, compatibilityWindowMs = 800 } = options;
  if (!Number.isFinite(movementTolerance) || movementTolerance < 0 || !Number.isFinite(compatibilityWindowMs) || compatibilityWindowMs < 0)
    throw new RangeError('Invalid touch activation limits');
  let press: { button: HTMLButtonElement; id: number; x: number; y: number; moved: boolean } | null = null;
  let ended: { button: HTMLButtonElement; at: number } | null = null;
  const buttonAt = (target: EventTarget | null): HTMLButtonElement | null => {
    const button = resolveButton(target);
    return button && root.contains(button) ? button : null;
  };
  const down = (event: PointerEvent): void => {
    if (!event.isPrimary || (event.pointerType !== 'touch' && event.pointerType !== 'pen')) return;
    const button = buttonAt(event.target);
    if (button && !button.disabled) press = { button, id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  };
  const move = (event: PointerEvent): void => {
    if (press?.id === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) > movementTolerance) press.moved = true;
  };
  const up = (event: PointerEvent): void => {
    if (!press || press.id !== event.pointerId) return;
    const saved = press; press = null; ended = { button: saved.button, at: event.timeStamp };
    const hit = buttonAt(root.ownerDocument.elementFromPoint(event.clientX, event.clientY));
    if (event.type === 'pointerup' && !saved.moved && hit === saved.button && !saved.button.disabled && root.contains(saved.button)) saved.button.click();
  };
  const click = (event: MouseEvent): void => {
    if (event.detail > 0 && ended?.button === buttonAt(event.target) && event.timeStamp - ended.at < compatibilityWindowMs &&
      (!('pointerType' in event) || (event as PointerEvent).pointerType !== 'mouse')) {
      event.preventDefault(); event.stopImmediatePropagation();
    }
  };
  root.addEventListener('pointerdown', down, true); root.addEventListener('pointermove', move, true);
  root.addEventListener('pointerup', up, true); root.addEventListener('pointercancel', up, true);
  root.addEventListener('click', click, true);
  return () => {
    press = null; ended = null;
    root.removeEventListener('pointerdown', down, true); root.removeEventListener('pointermove', move, true);
    root.removeEventListener('pointerup', up, true); root.removeEventListener('pointercancel', up, true);
    root.removeEventListener('click', click, true);
  };
}
