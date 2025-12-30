import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    dir: 'src',
    include: ['**/*.api.spec.ts'],
    reporters: 'default',
    setupFiles: [], // ex: ['./tests/setup-api.ts']
    clearMocks: true,
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
