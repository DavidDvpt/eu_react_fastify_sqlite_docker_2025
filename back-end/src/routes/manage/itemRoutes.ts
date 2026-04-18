import { ItemsService } from '../../modules/items/index.js';

import { itemCreateSchema, itemUpdateSchema } from './itemRoute.schema.js';

import type { FastifyPluginCallback } from 'fastify';

const itemRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const itemsService = new ItemsService(app.repos.items);

  app.get('/', async (request, reply) => {
    const rows = await itemsService.list(request.user.id);
    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await itemsService.getById(params.id, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body = itemCreateSchema.parse(request.body);
    const created = await itemsService.create(body, request.user.id);
    return reply.code(201).send(created);
  });

  app.put('/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = itemUpdateSchema.parse(request.body);
      const updated = await itemsService.update(params.id, body, request.user.id);
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

export default itemRoutes;
