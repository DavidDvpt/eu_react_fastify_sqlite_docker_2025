import { itemFormSchema, itemQuerySchema } from '@eu/zod-schemas';

import { getReadableUserIds } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { ItemService } from '#src/lib/services/index.js';

const itemRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const is = new ItemService(prismaClient);

  app.get('/', async (request, reply) => {
    const { sortKey, sortOrder, typeId, isActive } = itemQuerySchema.parse(request.query);

    const rows = await is.getAll({
      userIds: getReadableUserIds(request),
      isActive: isActive,
      typeId,
      sort: { key: sortKey ?? 'name', order: sortOrder },
    });
    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await is.getById({
      id: params.id,
      userIds: getReadableUserIds(request),
    });

    if (!row) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body = itemFormSchema.parse(request.body);
    const created = await is.create({ userId: request.user.id, body });

    return reply.code(201).send(created);
  });

  app.put('/:id', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = itemFormSchema.parse(request.body);
      const updated = await is.update({ id: params.id, userId: request.user.id, body });

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
