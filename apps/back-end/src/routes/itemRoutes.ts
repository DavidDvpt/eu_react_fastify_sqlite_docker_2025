import {
  dateSortKeySchema,
  itemFormSchema,
  itemQuerySchema,
  lotQuerySchema,
} from '@eu/zod-schemas';

import { getIdParam, getReadableUserIds, getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import {
  InventoryService,
  ItemService,
  LotService,
  StockService,
} from '#src/lib/services/index.js';

const itemRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const is = new ItemService(prismaClient);

  app.protect();

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

  app.get('/:id/stock', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { id } = request.params as { id: string };
    const stock = await is.getStock({ userId, itemId: id });

    return stock;
  });

  app.get('/:id/lots', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { id } = getIdParam(request);
    const { sortKey, sortOrder, isActive } = lotQuerySchema.partial().parse(request.query);

    const lots = await is.getLots({
      userId,
      itemId: id,
      isActive,
      sort: sortKey && { key: sortKey, order: sortOrder },
    });

    if (!lots) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(lots);
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

  // Mutations
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
