import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    dir: "src", // ou "tests" si tu préfères
    include: ["**/*.bdd.spec.ts"],
    reporters: "default",
    setupFiles: [], // ex: ["./tests/setup-db.ts"] si besoin
    clearMocks: true,
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
