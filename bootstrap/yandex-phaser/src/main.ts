import Phaser from 'phaser';

import { createStartupPreloadDomView, StartupPreloadController } from '@danilah/mini-games-kit/startup';

import './style.css';
import { installDebugPanel } from './app/debug';
import { createPlatformRuntime } from './app/platform';
import {
  afterPaintFrames,
  detectRuntimeImageFormat,
  getStartupSnapshot,
  startupTimeline,
} from './app/startup';
import { getInitialGameSize, installViewportRuntime } from './app/viewport';
import { BootstrapScene, GAME_PRESENTABLE_EVENT } from './game/BootstrapScene';

const preload = new StartupPreloadController(createStartupPreloadDomView());
preload.begin();

const platformTask = createPlatformRuntime().then((platform) => {
  startupTimeline.mark('platformReady');
  return platform;
});
const artFormatTask = detectRuntimeImageFormat();

try {
  const [platform, runtimeImageFormat] = await Promise.all([platformTask, artFormatTask]);
  const initialSize = getInitialGameSize();
  let resolvePresentable!: () => void;
  const presentable = new Promise<void>((resolve) => {
    resolvePresentable = resolve;
  });

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-root',
    width: Math.round(initialSize.width),
    height: Math.round(initialSize.height),
    backgroundColor: '#0b0d10',
    scene: [BootstrapScene],
    scale: { mode: Phaser.Scale.NONE },
    callbacks: {
      preBoot: (bootingGame) => {
        bootingGame.events.once(GAME_PRESENTABLE_EVENT, resolvePresentable);
      },
    },
  });

  const viewport = installViewportRuntime(game, platform.activity);
  const debug = installDebugPanel(() => getStartupSnapshot(runtimeImageFormat));

  void presentable.then(async () => {
    startupTimeline.mark('gamePresentable');
    await afterPaintFrames(2);
    startupTimeline.mark('ready');
    platform.markReady();
    platform.activity.setGameplayDesired(true);
    preload.complete();
  });

  window.addEventListener('pagehide', () => {
    platform.activity.setGameplayDesired(false);
    debug.destroy();
    viewport.destroy();
    preload.destroy();
    platform.destroy();
    game.destroy(true);
  }, { once: true });
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  preload.fail(message);
  console.error('Fatal bootstrap failure', error);
}
