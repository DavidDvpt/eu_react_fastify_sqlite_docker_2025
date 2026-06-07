import { TransactionStatusService } from '../modules/transactionStatus/index.js';

import {
  transactionSellQuerySchema,
  updateTransactionLineStatusBodySchema,
  updateTransactionLineStatusParamsSchema,
} from './transactionRoutes.schema.js';

import type { FastifyPluginCallback, FastifyRequest } from 'fastify';

function getRequestUserId(request: FastifyRequest): string {
  const user = request.user as { id?: string } | undefined;
  if (!user?.id) {
    throw new Error('Unauthorized');
  }
  return user.id;
}

const transactionRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const transactionStatusService = new TransactionStatusService(app.prisma);
  app.protect();

  app.get('/transactions/sell', async (request, reply) => {
    const userId = getRequestUserId(request);
    const query = transactionSellQuerySchema.parse(request.query);
    const rows = await app.repos.transactionRepository.getSellSessions(userId, query.status);
    return reply.code(200).send(rows);
  });

  app.get('/transactions/sell/running-lines', async (request, reply) => {
    const userId = getRequestUserId(request);
    const rows = await app.repos.transactionRepository.getRunningSellLines(userId);
    return reply.code(200).send(rows);
  });

  app.patch('/transactions/sell/lines/:id/status', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = updateTransactionLineStatusParamsSchema.parse(request.params);
    const body = updateTransactionLineStatusBodySchema.parse(request.body);

    try {
      const result = await transactionStatusService.updateTransactionLineStatus(userId, {
        transactionLotId: params.id,
        nextSaleStatus: body.status,
      });
      return reply.code(200).send(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'SELL_RUNNING_LINE_NOT_FOUND') {
        return reply.code(404).send({ message: 'Running transaction line not found' });
      }
      if (error instanceof Error && error.message === 'SELL_LINE_LOT_NOT_FOUND') {
        return reply.code(409).send({ message: 'Transaction line has no linked inventory lot' });
      }
      throw error;
    }
  });

  done();
};

export default transactionRoutes;
