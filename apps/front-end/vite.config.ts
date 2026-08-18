/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

const packageSourceAliases = {
  "@eu/helpers": path.resolve(__dirname, "../../packages/helpers/src/index.ts"),
  "@eu/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
  "@eu/zod-schemas": path.resolve(
    __dirname,
    "../../packages/zodSchemas/src/index.ts",
  ),
};

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      ...(command === "serve" || process.env.VITEST ? packageSourceAliases : {}),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
    css: true,
  },
}));
