import { lotQuerySchema } from '@eu/zod-schemas';

import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { InventoryService, StockService } from '#src/lib/services/domain/index.js';

const inventoryRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const is = new InventoryService(prismaClient, new StockService());

  app.protect();

  app.get('/inventory/lots', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { sortKey, sortOrder, isActive } = lotQuerySchema.parse(request.query);

    const rows = await is.getLots({ userId, isActive, sort: { key: sortKey, order: sortOrder } });

    return reply.code(200).send(rows);
  });

  app.get('/inventory/stock', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { sortKey, sortOrder, isActive } = lotQuerySchema.parse(request.query);

    const rows = await is.getStocks({ userId, isActive, sort: { key: sortKey, order: sortOrder } });

    return reply.code(200).send(rows);
  });

  done();
};

export default inventoryRoutes;
