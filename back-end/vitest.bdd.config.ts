import { defineConfig } from 'vitest/config';

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    dir: 'src',
    include: ['**/*.bdd.spec.ts'],
    reporters: 'default',
    setupFiles: [],
    clearMocks: true,
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
