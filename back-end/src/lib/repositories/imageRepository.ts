import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildStorageImageIndex,
  downloadStorageImageIndex,
  getDefaultStorageIndexPath,
  loadStorageImageIndex,
  writeStorageImageIndex,
} from '../storageImageIndex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.resolve(__dirname, '../../../storage');
const STORAGE_INDEX_PATH = getDefaultStorageIndexPath(STORAGE_DIR);
const REMOTE_INDEX_URL = process.env.STORAGE_IMAGE_INDEX_URL;
const REMOTE_IMAGE_BASE_URL = process.env.STORAGE_IMAGE_BASE_URL?.replace(/\/+$/, '');
const INDEX_CACHE_TTL_MS = Number(process.env.STORAGE_IMAGE_INDEX_CACHE_TTL_MS ?? 300_000);

type ImageSize = 'micro' | 'normal';

function toAbsoluteIndexMap(index: Record<string, string>): Map<string, string> {
  return new Map(
    Object.entries(index).map(([id, relativePath]) => {
      if (REMOTE_IMAGE_BASE_URL) {
        const normalizedRelativePath = relativePath.replace(/^\/+/, '');
        return [id, `${REMOTE_IMAGE_BASE_URL}/${normalizedRelativePath}`];
      }
      return [id, path.join(STORAGE_DIR, relativePath)];
    })
  );
}

export class ImageRepository {
  private microImageIndexPromise: Promise<Map<string, string>> | null = null;
  private normalImageIndexPromise: Promise<Map<string, string>> | null = null;
  private microImageIndexLoadedAt = 0;
  private normalImageIndexLoadedAt = 0;

  private async rebuildAndPersistMicroImageIndex(): Promise<Map<string, string>> {
    const built = await buildStorageImageIndex(STORAGE_DIR);
    await writeStorageImageIndex(STORAGE_DIR, built, STORAGE_INDEX_PATH);
    return toAbsoluteIndexMap(built.micro);
  }

  private async rebuildAndPersistNormalImageIndex(): Promise<Map<string, string>> {
    const built = await buildStorageImageIndex(STORAGE_DIR);
    await writeStorageImageIndex(STORAGE_DIR, built, STORAGE_INDEX_PATH);
    return toAbsoluteIndexMap(built.normal);
  }

  private async loadMicroImageIndex(): Promise<Map<string, string>> {
    if (REMOTE_INDEX_URL) {
      try {
        const downloaded = await downloadStorageImageIndex(REMOTE_INDEX_URL);
        console.log('[images] index loaded', {
          kind: 'micro',
          from: 'remote',
          url: REMOTE_INDEX_URL,
          keyCount: Object.keys(downloaded.micro).length,
        });
        await writeStorageImageIndex(STORAGE_DIR, downloaded, STORAGE_INDEX_PATH);
        return toAbsoluteIndexMap(downloaded.micro);
      } catch {
        console.warn('[images] index load failed', {
          kind: 'micro',
          from: 'remote',
          url: REMOTE_INDEX_URL,
        });
        return new Map();
      }
    }

    try {
      const index = await loadStorageImageIndex(STORAGE_DIR, STORAGE_INDEX_PATH);
      console.log('[images] index loaded', {
        kind: 'micro',
        from: 'local',
        path: STORAGE_INDEX_PATH,
        keyCount: Object.keys(index.micro).length,
      });
      return toAbsoluteIndexMap(index.micro);
    } catch {
      console.warn('[images] index load failed', {
        kind: 'micro',
        from: 'local',
        path: STORAGE_INDEX_PATH,
      });
      return this.rebuildAndPersistMicroImageIndex();
    }
  }

  private async loadNormalImageIndex(): Promise<Map<string, string>> {
    if (REMOTE_INDEX_URL) {
      try {
        const downloaded = await downloadStorageImageIndex(REMOTE_INDEX_URL);
        console.log('[images] index loaded', {
          kind: 'normal',
          from: 'remote',
          url: REMOTE_INDEX_URL,
          keyCount: Object.keys(downloaded.normal).length,
        });
        await writeStorageImageIndex(STORAGE_DIR, downloaded, STORAGE_INDEX_PATH);
        return toAbsoluteIndexMap(downloaded.normal);
      } catch {
        console.warn('[images] index load failed', {
          kind: 'normal',
          from: 'remote',
          url: REMOTE_INDEX_URL,
        });
        return new Map();
      }
    }

    try {
      const index = await loadStorageImageIndex(STORAGE_DIR, STORAGE_INDEX_PATH);
      console.log('[images] index loaded', {
        kind: 'normal',
        from: 'local',
        path: STORAGE_INDEX_PATH,
        keyCount: Object.keys(index.normal).length,
      });
      return toAbsoluteIndexMap(index.normal);
    } catch {
      console.warn('[images] index load failed', {
        kind: 'normal',
        from: 'local',
        path: STORAGE_INDEX_PATH,
      });
      return this.rebuildAndPersistNormalImageIndex();
    }
  }

  private isCacheExpired(loadedAt: number): boolean {
    if (INDEX_CACHE_TTL_MS <= 0) {
      return true;
    }
    return Date.now() - loadedAt > INDEX_CACHE_TTL_MS;
  }

  private getMicroImageIndex(): Promise<Map<string, string>> {
    if (!this.microImageIndexPromise || this.isCacheExpired(this.microImageIndexLoadedAt)) {
      this.microImageIndexPromise = this.loadMicroImageIndex();
      this.microImageIndexLoadedAt = Date.now();
    }
    return this.microImageIndexPromise;
  }

  private getNormalImageIndex(): Promise<Map<string, string>> {
    if (!this.normalImageIndexPromise || this.isCacheExpired(this.normalImageIndexLoadedAt)) {
      this.normalImageIndexPromise = this.loadNormalImageIndex();
      this.normalImageIndexLoadedAt = Date.now();
    }
    return this.normalImageIndexPromise;
  }

  async getImageBufferById(id: string, size: ImageSize): Promise<Buffer | null> {
    const getIndex =
      size === 'micro' ? this.getMicroImageIndex.bind(this) : this.getNormalImageIndex.bind(this);
    const rebuild =
      size === 'micro'
        ? this.rebuildAndPersistMicroImageIndex.bind(this)
        : this.rebuildAndPersistNormalImageIndex.bind(this);
    const setPromise = (promise: Promise<Map<string, string>>) => {
      if (size === 'micro') {
        this.microImageIndexPromise = promise;
        this.microImageIndexLoadedAt = Date.now();
      } else {
        this.normalImageIndexPromise = promise;
        this.normalImageIndexLoadedAt = Date.now();
      }
    };

    let imageIndex: Map<string, string>;
    try {
      imageIndex = await getIndex();
    } catch {
      return null;
    }
    let filePath = imageIndex.get(id);
    console.log('[images] lookup', {
      id,
      size,
      foundInIndex: Boolean(filePath),
      source: REMOTE_INDEX_URL ? 'remote-index' : 'local-index',
      remoteIndexUrl: REMOTE_INDEX_URL ?? null,
      remoteImageBaseUrl: REMOTE_IMAGE_BASE_URL ?? null,
      resolvedPath: filePath ?? null,
    });

    if (!filePath) {
      if (REMOTE_IMAGE_BASE_URL || REMOTE_INDEX_URL) {
        return null;
      }
      const rebuiltPromise = rebuild();
      setPromise(rebuiltPromise);
      try {
        imageIndex = await rebuiltPromise;
      } catch {
        return null;
      }
      filePath = imageIndex.get(id);
    }

    if (!filePath) {
      return null;
    }

    if (/^https?:\/\//i.test(filePath)) {
      const response = await fetch(filePath);
      if (!response.ok) {
        return null;
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    try {
      return await readFile(filePath);
    } catch {
      return null;
    }
  }
}
