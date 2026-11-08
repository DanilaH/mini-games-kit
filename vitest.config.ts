import { defineConfig } from 'vitest/config';

// Consumer probes contain another repository's tests; run them only in that copy.
export default defineConfig({ test: { include: ['tests/**/*.test.ts', 'bootstrap/yandex-phaser/tests/**/*.test.ts'] } });
