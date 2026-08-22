import {
  itemFormSchema,
  itemQuerySchema,
  lotQuerySchema,
  transactionQuerySchema,
} from '@eu/zod-schemas';

import { getIdParam, getReadableUserIds, getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { ItemService, TransactionService } from '#src/lib/services/index.js';

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
    const { sortKey, sortOrder, isActive, hasInitialValue } = lotQuerySchema
      .partial()
      .parse(request.query);

    const lots = await is.getLots({
      userId,
      itemId: id,
      isActive,
      sort: sortKey && { key: sortKey, order: sortOrder },
      hasInitialValue,
    });

    if (!lots) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(lots);
  });
  app.get('/:id/transactions', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { id } = getIdParam(request);
    const ts = new TransactionService(prismaClient);
    const { status, type, withItemId, withLotId } = transactionQuerySchema.partial().parse(
      request.query
    );

    const rows = await ts.getAll({
      userId,
      itemId: id,
      status,
      transactionType: type,
      withItemId,
      withLotId,
    });

    return reply.code(200).send(rows);
  });
  app.get('/:id/financial-report', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { id } = getIdParam(request);
    const { withLotId } = transactionQuerySchema.partial().parse(request.query);

    const ts = new TransactionService(prismaClient);

    const result = await ts.getAll({ userId, itemId: id, withLotId });

    return reply.code(200).send(result);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = getIdParam(request);

    const row = await is.getById({
      id,
      userIds: getReadableUserIds(request),
    });

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
