import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const IMAGE_FILE_PATTERN = /^(\d+)(Micro|Normal)\.jpg$/;
const INDEX_FILE_NAME = '.image-index.json';

type ImageSize = 'Micro' | 'Normal';

type StorageImageIndex = {
  generatedAt: string;
  micro: Record<string, string>;
  normal: Record<string, string>;
};

function getDefaultStorageIndexPath(storageDir: string): string {
  return path.join(storageDir, INDEX_FILE_NAME);
}

async function buildStorageImageIndex(storageDir: string): Promise<StorageImageIndex> {
  const micro = new Map<string, string>();
  const normal = new Map<string, string>();

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    entries.sort((left, right) =>
      left.name.localeCompare(right.name, 'fr', { sensitivity: 'base' })
    );

    for (const entry of entries) {
      if (entry.name === 'jsons') {
        continue;
      }

      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const match = entry.name.match(IMAGE_FILE_PATTERN);
      if (!match) {
        continue;
      }

      const id = match[1];
      const size = match[2] as ImageSize;
      const relativePath = path.relative(storageDir, absolutePath);
      const target = size === 'Micro' ? micro : normal;
      if (!target.has(id)) {
        target.set(id, relativePath);
      }
    }
  }

  await walk(storageDir);

  return {
    generatedAt: new Date().toISOString(),
    micro: Object.fromEntries(micro.entries()),
    normal: Object.fromEntries(normal.entries()),
  };
}

async function writeStorageImageIndex(
  storageDir: string,
  index: StorageImageIndex,
  indexPath = getDefaultStorageIndexPath(storageDir)
): Promise<void> {
  await mkdir(path.dirname(indexPath), { recursive: true });
  await writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
}

async function loadStorageImageIndex(
  storageDir: string,
  indexPath = getDefaultStorageIndexPath(storageDir)
): Promise<StorageImageIndex> {
  const raw = await readFile(indexPath, 'utf8');
  const parsed = JSON.parse(raw) as Partial<StorageImageIndex>;

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    !parsed.micro ||
    typeof parsed.micro !== 'object' ||
    !parsed.normal ||
    typeof parsed.normal !== 'object'
  ) {
    throw new Error(`Invalid storage image index at ${indexPath}`);
  }

  return {
    generatedAt:
      typeof parsed.generatedAt === 'string' ? parsed.generatedAt : new Date(0).toISOString(),
    micro: parsed.micro as Record<string, string>,
    normal: parsed.normal as Record<string, string>,
  };
}

export {
  INDEX_FILE_NAME,
  buildStorageImageIndex,
  getDefaultStorageIndexPath,
  loadStorageImageIndex,
  writeStorageImageIndex,
};
export type { StorageImageIndex };
