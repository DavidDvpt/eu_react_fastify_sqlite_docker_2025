import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildStorageImageIndex,
  getDefaultStorageIndexPath,
  loadStorageImageIndex,
  writeStorageImageIndex,
} from '../storageImageIndex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.resolve(__dirname, '../../../storage');
const STORAGE_INDEX_PATH = getDefaultStorageIndexPath(STORAGE_DIR);

type ImageSize = 'micro' | 'normal';

function toAbsoluteIndexMap(index: Record<string, string>): Map<string, string> {
  return new Map(
    Object.entries(index).map(([id, relativePath]) => [id, path.join(STORAGE_DIR, relativePath)])
  );
}

export class ImageRepository {
  private microImageIndexPromise: Promise<Map<string, string>> | null = null;
  private normalImageIndexPromise: Promise<Map<string, string>> | null = null;

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
    try {
      const index = await loadStorageImageIndex(STORAGE_DIR, STORAGE_INDEX_PATH);
      return toAbsoluteIndexMap(index.micro);
    } catch {
      return this.rebuildAndPersistMicroImageIndex();
    }
  }

  private async loadNormalImageIndex(): Promise<Map<string, string>> {
    try {
      const index = await loadStorageImageIndex(STORAGE_DIR, STORAGE_INDEX_PATH);
      return toAbsoluteIndexMap(index.normal);
    } catch {
      return this.rebuildAndPersistNormalImageIndex();
    }
  }

  private getMicroImageIndex(): Promise<Map<string, string>> {
    if (!this.microImageIndexPromise) {
      this.microImageIndexPromise = this.loadMicroImageIndex();
    }
    return this.microImageIndexPromise;
  }

  private getNormalImageIndex(): Promise<Map<string, string>> {
    if (!this.normalImageIndexPromise) {
      this.normalImageIndexPromise = this.loadNormalImageIndex();
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
      } else {
        this.normalImageIndexPromise = promise;
      }
    };

    let imageIndex = await getIndex();
    let filePath = imageIndex.get(id);

    if (!filePath) {
      const rebuiltPromise = rebuild();
      setPromise(rebuiltPromise);
      imageIndex = await rebuiltPromise;
      filePath = imageIndex.get(id);
    }

    if (!filePath) {
      return null;
    }

    return readFile(filePath);
  }
}
