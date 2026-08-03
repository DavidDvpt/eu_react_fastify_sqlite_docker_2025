import { itemFormSchema, itemQuerySchema, lotQuerySchema } from '@eu/zod-schemas';

import { getIdParam, getReadableUserIds, getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { ItemService } from '#src/lib/services/index.js';

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
    const { id } = getIdParam(request);

    const stock = await is.getStock({ userId, itemId: id });

    return reply.code(200).send(stock);
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
    const { id } = getIdParam(request);

    const row = await is.getById({
      id,
      userIds: getReadableUserIds(request),
    });

    if (!row) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(row);
  });

  // Mutations
  app.post('/', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = itemFormSchema.parse(request.body);
    const created = await is.create({ userId, body });

    return reply.code(201).send(created);
  });
  app.put('/:id', async (request, reply) => {
    const { id } = getIdParam(request);
    const body = itemFormSchema.parse(request.body);

    const updated = await is.update({ id, userId: request.user.id, body });

    return reply.code(200).send(updated);
  });

  done();
};

export default itemRoutes;
