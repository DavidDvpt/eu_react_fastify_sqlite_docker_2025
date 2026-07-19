import { typeFormSchema } from '@eu/zod-schemas';
import { TypesService } from 'src/lib/services/typeService.js';

import type { TypeFormBody } from '@eu/types';
import type { FastifyPluginCallback } from 'fastify';

const typeRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const typesService = new TypesService();

  app.get('/', async (request, reply) => {
    const rows = await typesService.getAll(request.user.id);
    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await typesService.getById(params.id, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Type not found' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body: TypeFormBody = typeFormSchema.parse(request.body);
    const created = await typesService.create(request.user.id, body);
    return reply.code(201).send(created);
  });

  app.patch('/:id', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body: Partial<TypeFormBody> = typeFormSchema.partial().parse(request.body);
      const updated = await typesService.update(params.id, body, request.user.id);
      return reply.code(200).send(updated);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  done();
};

export default typeRoutes;
