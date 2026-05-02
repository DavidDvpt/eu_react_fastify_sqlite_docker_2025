import { z } from 'zod';

import { StocksService } from '../modules/stocks/index.js';

import { stockByItemParamsSchema, stockByItemQuerySchema } from './stockRoutes.schema.js';
import { getRequestUserId } from './utils.js';

import type { StockByItemRow, StockItemDetails } from '../types/index.js';
import type { FastifyPluginCallback } from 'fastify';

const stockRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const stocksService = new StocksService(app.repos.lotStock);
  app.protect();

  app.get('/inventory', async (request, reply) => {
    const userId = getRequestUserId(request);
    const rows: StockByItemRow[] = await stocksService.list(userId);
    return reply.code(200).send(rows);
  });

  app.get('/inventory/:id', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = stockByItemParamsSchema.parse(request.params);
    const parsedQuery = stockByItemQuerySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      return reply.code(400).send({ message: 'Invalid stock query' });
    }

    if (parsedQuery.data.include === 'details') {
      const details: StockItemDetails | null = await stocksService.getDetailsByItemId(
        userId,
        params.id
      );
      if (!details) {
        return reply.code(404).send({ message: 'Stock not found for item' });
      }
      return reply.code(200).send(details);
    }

    const row: StockByItemRow | null = await stocksService.getByItemId(userId, params.id);
    if (!row) {
      return reply.code(404).send({ message: 'Stock not found for item' });
    }
    return reply.code(200).send(row);
  });

  done();
};

export default stockRoutes;
