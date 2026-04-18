import { TypesService } from '../../modules/types/index.js';

import { typeCreateSchema, typeUpdateSchema } from './typeRoutes.schema.js';

import type { FastifyPluginCallback } from 'fastify';

const typeRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const typesService = new TypesService(app.repos.types);

  app.get('/', async (request, reply) => {
    const rows = await typesService.list(request.user.id);
    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await typesService.getById(params.id, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Type not found' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body = typeCreateSchema.parse(request.body);
    const created = await typesService.create(body, request.user.id);
    return reply.code(201).send(created);
  });

  app.put('/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = typeUpdateSchema.parse(request.body);
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
