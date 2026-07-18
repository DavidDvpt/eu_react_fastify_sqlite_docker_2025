import { defineConfig } from 'vitest/config';

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    dir: 'src',
    include: ['**/*.api.spec.ts'],
    reporters: 'default',
    setupFiles: ['./vitest.api.setup.ts'],
    clearMocks: true,
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
