import { StocksService } from '../modules/index.js';

import {
  stockByItemParamsSchema as inventoryByItemParamsSchema,
  stockByItemQuerySchema as inventoryByItemQuerySchema,
} from './inventoryRoutes.schema.js';
import { getRequestUserId } from './utils.js';

import type { InventoryByItemRow, InventoryItemDetails } from '../types/index.js';
import type { FastifyPluginCallback } from 'fastify';

const inventoryRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const stocksService = new StocksService(app.repos.lotStock);
  app.protect();

  app.get('/inventory', async (request, reply) => {
    const userId = getRequestUserId(request);
    const rows: InventoryByItemRow[] = await stocksService.list(userId);
    return reply.code(200).send(rows);
  });

  app.get('/inventory/:id', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = inventoryByItemParamsSchema.parse(request.params);
    const parsedQuery = inventoryByItemQuerySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      return reply.code(400).send({ message: 'Invalid inventory query' });
    }

    if (parsedQuery.data.include === 'details') {
      const details: InventoryItemDetails | null = await stocksService.getDetailsByItemId(
        userId,
        params.id
      );
      if (!details) {
        return reply.code(404).send({ message: 'Inventory not found for item' });
      }
      return reply.code(200).send(details);
    }

    const row: InventoryByItemRow | null = await stocksService.getByItemId(userId, params.id);
    if (!row) {
      return reply.code(404).send({ message: 'Inventory not found for item' });
    }
    return reply.code(200).send(row);
  });

  done();
};

export default inventoryRoutes;
