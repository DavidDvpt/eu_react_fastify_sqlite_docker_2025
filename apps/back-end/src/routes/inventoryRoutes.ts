import { lotQuerySchema, transactionQuerySchema } from '@eu/zod-schemas';

import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { toInventoryFinancialReport } from '#src/lib/helpers/transactionFinancialReportHelper.js';
import { InventoryService, StockService } from '#src/lib/services/domain/index.js';
import { TransactionService } from '#src/lib/services/index.js';

const inventoryRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const is = new InventoryService(prismaClient, new StockService());

  app.protect();

  app.get('/lots', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { sortKey, sortOrder, isActive, hasInitialValue } = lotQuerySchema.parse(request.query);

    const rows = await is.getLots({
      userId,
      isActive,
      sort: { key: sortKey, order: sortOrder },
      hasInitialValue,
    });

    return reply.code(200).send(rows);
  });

  app.get('/stock', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { sortKey, sortOrder, isActive } = lotQuerySchema.partial().parse(request.query);
    const rows = await is.getStocks({
      userId,
      isActive,
      sort: sortKey ? { key: sortKey, order: sortOrder } : undefined,
    });

    return reply.code(200).send(rows);
  });

  app.get('/financial-report', async (request, reply) => {
    const userId = getRequestUserId(request);

    const { withLotId } = transactionQuerySchema.partial().parse(request.query);

    const ts = new TransactionService(prismaClient);

    const rows = await ts.getAll({ userId, withLotId });

    const parsed = toInventoryFinancialReport(rows);

    return reply.code(200).send(parsed);
  });
  done();
};

export default inventoryRoutes;
