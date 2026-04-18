import type { ImageRepository } from '../../lib/repositories/index.js';

type ImageSize = 'micro' | 'normal';

class ImagesService {
  constructor(private readonly imageRepository: ImageRepository) {}

  getBufferById(id: string, size: ImageSize): Promise<Buffer | null> {
    return this.imageRepository.getImageBufferById(id, size);
  }
}

export { ImagesService };

