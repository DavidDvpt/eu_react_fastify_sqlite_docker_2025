import { lotQuerySchema } from '@eu/zod-schemas';

import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { InventoryService, StockService } from '#src/lib/services/domain/index.js';

const inventoryRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const is = new InventoryService(prismaClient, new StockService());

  app.protect();

  app.get('/inventory', async (request, reply) => {
    const userId = getRequestUserId(request);

    const rows = await is.getInventory({ userId });

    return reply.code(200).send(rows);
  });

  app.get('/inventory/stock', async (request, reply) => {
    const userId = getRequestUserId(request);

    const rows = await is.getStock({ userId });

    return reply.code(200).send(rows);
  });

  done();
};

export default inventoryRoutes;
