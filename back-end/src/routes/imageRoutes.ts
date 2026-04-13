import { imageIdParamsSchema, imageQuerySchema } from './imageRoutes.schema.js';

import type { ImageRepository } from '../lib/repositories/imageRepository.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

type AppWithImageRepo = FastifyInstance & {
  repos: {
    images: ImageRepository;
  };
};

const imageRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const imageApp = app as AppWithImageRepo;
  const imagesRepo = imageApp.repos.images;

  app.get('/storage/images/:id', async (request, reply) => {
    const parsed = imageIdParamsSchema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ message: 'Invalid image id' });
    }

    const parsedQuery = imageQuerySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      return reply.code(400).send({ message: 'Invalid image size' });
    }

    const imageBuffer = await imagesRepo.getImageBufferById(parsed.data.id, parsedQuery.data.size);
    if (!imageBuffer) {
      return reply.code(404).send({ message: 'Image not found' });
    }

    return reply.type('image/jpeg').send(imageBuffer);
  });

  done();
};

export default imageRoutes;
