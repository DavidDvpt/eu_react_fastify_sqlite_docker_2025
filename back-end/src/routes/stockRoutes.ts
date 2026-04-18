import { z } from 'zod';

import { stockByItemParamsSchema, stockByItemQuerySchema } from './stockRoutes.schema.js';

import type { StockByItemRow, StockItemDetails } from '../types/index.js';
import type { FastifyPluginCallback, FastifyRequest } from 'fastify';

const requestUserSchema = z.object({
  id: z.string().min(1),
});

function getRequestUserId(request: FastifyRequest): string {
  return requestUserSchema.parse(request.user as unknown).id;
}

const stockRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();

  app.get('/stock', async (request, reply) => {
    const userId = getRequestUserId(request);
    const rows: StockByItemRow[] = await app.repos.lotStock.getStock(userId);
    return reply.code(200).send(rows);
  });

  app.get('/stock/:id', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = stockByItemParamsSchema.parse(request.params);
    const parsedQuery = stockByItemQuerySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      return reply.code(400).send({ message: 'Invalid stock query' });
    }

    if (parsedQuery.data.include === 'details') {
      const details: StockItemDetails | null = await app.repos.lotStock.getStockDetailsByItemId(
        userId,
        params.id
      );
      if (!details) {
        return reply.code(404).send({ message: 'Stock not found for item' });
      }
      return reply.code(200).send(details);
    }

    const row: StockByItemRow | null = await app.repos.lotStock.getStockByItemId(userId, params.id);
    if (!row) {
      return reply.code(404).send({ message: 'Stock not found for item' });
    }
    return reply.code(200).send(row);
  });

  done();
};

export default stockRoutes;
