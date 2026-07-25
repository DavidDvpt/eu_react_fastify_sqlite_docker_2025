import { defineConfig, env } from "prisma/config";
import './src/config/env.js';

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "NODE_OPTIONS=--conditions=development tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
