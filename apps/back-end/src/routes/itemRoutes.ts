import { itemFormSchema } from '@eu/zod-schemas';

import type { FastifyPluginCallback } from 'fastify';

import { ItemService } from '#src/lib/services/itemService.js';

const itemRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.get('/', async (request, reply) => {
    const rows = await ItemService.getAll(request.user.id);
    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await ItemService.getById(params.id, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body = itemFormSchema.parse(request.body);
    const created = await ItemService.create(request.user.id, body);

    return reply.code(201).send(created);
  });

  app.put('/:id', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = itemFormSchema.parse(request.body);
      const updated = await ItemService.update(params.id, request.user.id, body);

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
