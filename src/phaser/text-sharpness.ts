import Phaser from 'phaser';

import { getRenderPixelRatio } from '../core/render-density.js';

/** Applies current render density to Text objects added during one Scene activation. */
export const installSceneTextSharpness = (
  scene: Phaser.Scene,
  resolvePixelRatio: () => number = () => getRenderPixelRatio(),
): (() => void) => {
  const applyTextResolution = (gameObject: Phaser.GameObjects.GameObject): void => {
    if (gameObject instanceof Phaser.GameObjects.Text) {
      gameObject.setResolution(resolvePixelRatio());
    }
  };

  scene.events.on(Phaser.Scenes.Events.ADDED_TO_SCENE, applyTextResolution);
  const uninstall = (): void => scene.events.off(Phaser.Scenes.Events.ADDED_TO_SCENE, applyTextResolution);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, uninstall);
  return uninstall;
};
