import Phaser from 'phaser';

export interface RuntimeImageAsset {
  textureKey: string;
  assetPath: string;
}

/**
 * Loads only missing image textures for the current Scene activation.
 * Shutdown resolves and detaches listeners so stale async work cannot retain a dead Scene.
 * Failed files stay absent from the texture manager and can therefore be retried later.
 */
export const ensureRuntimeImageTextures = async (
  scene: Phaser.Scene,
  assets: readonly RuntimeImageAsset[],
  failureLabel = 'runtime images',
): Promise<void> => {
  if (!scene.sys.isActive()) return;
  const missing = assets.filter(({ textureKey }) => !scene.textures.exists(textureKey));
  if (missing.length === 0) return;

  await new Promise<void>((resolve, reject) => {
    const pendingKeys = new Set(missing.map(({ textureKey }) => textureKey));
    const failedKeys = new Set<string>();
    let settled = false;

    const cleanup = (): void => {
      scene.load.off('loaderror', onLoadError);
      scene.load.off(Phaser.Loader.Events.COMPLETE, onComplete);
      scene.events.off(Phaser.Scenes.Events.SHUTDOWN, onShutdown);
    };
    const finish = (error?: Error): void => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const onLoadError = (file: Phaser.Loader.File): void => {
      const key = String(file.key);
      if (pendingKeys.has(key)) failedKeys.add(key);
    };
    const onComplete = (): void => {
      if (failedKeys.size > 0) {
        finish(new Error(`Failed to load ${failureLabel}: ${[...failedKeys].join(', ')}`));
        return;
      }
      finish();
    };
    const onShutdown = (): void => finish();

    scene.load.on('loaderror', onLoadError);
    scene.load.once(Phaser.Loader.Events.COMPLETE, onComplete);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, onShutdown);
    for (const { textureKey, assetPath } of missing) scene.load.image(textureKey, assetPath);
    scene.load.start();
  });
};
