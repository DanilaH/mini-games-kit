import type Phaser from 'phaser';
/** Phaser 4.2.1 defers destroy to its next step. Wake a sleeping loop to complete it. */
export function destroyRenderer(game: Phaser.Game, destroyed: () => void = () => undefined): void {
  game.events.once('destroy', destroyed);
  game.destroy(true);
  if (game.loop.started && !game.loop.running) game.loop.wake();
}
