# Touch activation after captured gestures

Import `installTouchActivation` from `@danilah/mini-games-kit/feel`. DOM-only, no Phaser/Capacitor dependency. Extracted from Road Lines thumb controls.

```ts
const dispose = installTouchActivation(dock, {
  resolveButton: target => target instanceof Element ? target.closest('button') : null,
  movementTolerance: 12,
  compatibilityWindowMs: 800,
});
// Remove before replacing/discarding the dock.
dispose();
```

Install once on an opt-in dock whose native compatibility clicks are unreliable after a captured gameplay swipe. Touch/primary pen activates the original enabled button on release inside it; drag-away/cancel does not activate. Only the later compatibility click is consumed. Native mouse, keyboard and assistive detail=0 clicks remain available. Hit testing uses the root ownerDocument and rejects buttons outside the root. The installer removes every listener and pending press on disposal.

Do not use pointerdown as activation, install twice, or apply to every control without device evidence. This does not own button actions, sound, gesture capture, layout or game state. The numerical thresholds are configurable UX policy, not native-device guarantees. Browser regression covers swipe ending over the dock then an immediate tap, repeated real taps, cancel/drag, mouse/keyboard, disabled and dispose.
