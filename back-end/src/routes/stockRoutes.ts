import { z } from 'zod';

import { stockByItemParamsSchema } from './stockRoutes.schema.js';

import type { StockByItemRow } from '../lib/repositories/lotStatsRepository.js';
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
    const rows: StockByItemRow[] = await app.repos.lotStats.getStock(userId);
    return reply.code(200).send(rows);
  });

  app.get('/stock/:id', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = stockByItemParamsSchema.parse(request.params);
    const row: StockByItemRow | null = await app.repos.lotStats.getStockByItemId(userId, params.id);
    if (!row) {
      return reply.code(404).send({ message: 'Stock not found for item' });
    }
    return reply.code(200).send(row);
  });

  done();
};

export default stockRoutes;
