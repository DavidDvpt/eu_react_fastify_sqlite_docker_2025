import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const frontendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

loadEnvFile(path.join(frontendRoot, ".env.development"));

const openapiUrl = process.env.VITE_OPENAPI_URL;

if (!openapiUrl) {
  throw new Error(
    "VITE_OPENAPI_URL is not set in apps/frontend/.env.development.\n" +
      "Copy .env.development.example to .env.development and set the OpenAPI spec URL.",
  );
}

const target = path.join(frontendRoot, "src", "api", "openapi.json");

const response = await fetch(openapiUrl);
if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI spec (${response.status} ${response.statusText}): ${openapiUrl}`);
}

await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, await response.text());

console.log(`OpenAPI spec fetched from ${openapiUrl}`);
console.log(`Saved to ${target}`);