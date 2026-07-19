#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const packagesDir = path.join(rootDir, 'packages');
const appsDir = path.join(rootDir, 'apps');

const args = process.argv.slice(2);
const rawPackageName = args[0];

if (!rawPackageName || rawPackageName.startsWith('--')) {
  console.error('Usage: npm run package:create -- <package-name> [--apps back-end,front-end|all] [--no-install]');
  process.exit(1);
}

const packageName = rawPackageName.startsWith('@eu/') ? rawPackageName.slice(4) : rawPackageName;

if (!packageName || packageName.includes('/') || packageName.includes('\\')) {
  console.error('Package name must be a simple workspace name such as "helpers" or "date-utils".');
  process.exit(1);
}

let appNames = ['back-end'];
let shouldInstall = true;

for (let i = 1; i < args.length; i += 1) {
  const arg = args[i];

  if (arg === '--apps') {
    const value = args[i + 1];
    if (!value || value.startsWith('--')) {
      console.error('Missing value for --apps');
      process.exit(1);
    }

    appNames = value === 'all' ? await getAppNames() : value.split(',').map((name) => name.trim()).filter(Boolean);
    if (appNames.length === 0) {
      console.error('At least one app must be selected.');
      process.exit(1);
    }
    i += 1;
    continue;
  }

  if (arg === '--no-install') {
    shouldInstall = false;
    continue;
  }

  console.error(`Unknown argument: ${arg}`);
  process.exit(1);
}

const packageDir = path.join(packagesDir, packageName);
const srcDir = path.join(packageDir, 'src');
const packageJsonPath = path.join(packageDir, 'package.json');
const indexPath = path.join(srcDir, 'index.ts');
const scopedName = `@eu/${packageName}`;

await assertPackageDoesNotExist(packageJsonPath, scopedName);
await mkdir(srcDir, { recursive: true });

await writeFile(
  packageJsonPath,
  `${JSON.stringify(
    {
      name: scopedName,
      private: true,
      version: '0.0.0',
      type: 'module',
      main: './src/index.ts',
      types: './src/index.ts',
      exports: {
        '.': {
          types: './src/index.ts',
          default: './src/index.ts',
        },
      },
    },
    null,
    2
  )}\n`
);

await writeFile(
  indexPath,
  `// Scaffolded package entry point.\nexport {};\n`
);

const appPackageJsonPaths = await resolveAppPackageJsonPaths(appNames);

for (const appPackageJsonPath of appPackageJsonPaths) {
  const raw = await readFile(appPackageJsonPath, 'utf8');
  const appPackageJson = JSON.parse(raw);
  appPackageJson.dependencies ??= {};
  appPackageJson.dependencies[scopedName] ??= '*';
  await writeFile(appPackageJsonPath, `${JSON.stringify(appPackageJson, null, 2)}\n`);
}

if (shouldInstall) {
  const result = spawnSync('npm', ['install', '--ignore-scripts'], {
    cwd: rootDir,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Created ${scopedName}`);
console.log(`Updated apps: ${appNames.join(', ')}`);

async function assertPackageDoesNotExist(packageJsonPath, scopedNameToCheck) {
  try {
    const existing = JSON.parse(await readFile(packageJsonPath, 'utf8'));
    console.error(`Package already exists: ${existing.name ?? scopedNameToCheck}`);
    process.exit(1);
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function resolveAppPackageJsonPaths(targetAppNames) {
  const availableApps = await getAppNames();
  const missing = targetAppNames.filter((name) => !availableApps.includes(name));

  if (missing.length > 0) {
    console.error(`Unknown app(s): ${missing.join(', ')}`);
    process.exit(1);
  }

  return targetAppNames.map((name) => path.join(appsDir, name, 'package.json'));
}

async function getAppNames() {
  const entries = await readdir(appsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== '.' && name !== '..')
    .sort();
}
