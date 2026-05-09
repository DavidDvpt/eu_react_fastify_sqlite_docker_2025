import { ImagesService } from '../modules/images/index.js';

import { imageIdParamsSchema, imageQuerySchema } from './imageRoutes.schema.js';

import type { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';

async function handleGetImage(
  imagesService: ImagesService,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = imageIdParamsSchema.safeParse(request.params);
  if (!parsed.success) {
    return reply.code(400).send({ message: 'Invalid image id' });
  }

  const parsedQuery = imageQuerySchema.safeParse(request.query);
  if (!parsedQuery.success) {
    return reply.code(400).send({ message: 'Invalid image size' });
  }

  const imageBuffer = await imagesService.getBufferById(parsed.data.id, parsedQuery.data.size);
  if (!imageBuffer) {
    return reply.code(404).send({ message: 'Image not found' });
  }

  return reply.type('image/jpeg').send(imageBuffer);
}

const imageRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const imagesService = new ImagesService(app.repos.images);

  app.get('/assets/images/:id', async (request, reply) =>
    handleGetImage(imagesService, request, reply)
  );

  done();
};

export default imageRoutes;
