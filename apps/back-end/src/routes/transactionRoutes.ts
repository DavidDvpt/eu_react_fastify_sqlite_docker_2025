import { TransactionService } from '../lib/services/transactionService.js';
import { TransactionStatusService } from '../modules/transactionStatus/index.js';

import {
  transactionBodySchema,
  patchTransactionParamsSchema,
  patchTransactionBodySchema,
} from './transactionRoutes.schema.js';
import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

const transactionRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const transactionService = new TransactionService(app.prisma, app.repos);
  const transactionStatusService = new TransactionStatusService(app.prisma);
  app.protect();

  app.post('/transactions', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = transactionBodySchema.parse(request.body);

    let result: { transactionId: string };
    try {
      result =
        body.transactionType === 'BUY'
          ? await transactionService.buy(userId, body)
          : await transactionService.sell(userId, body);
    } catch (error) {
      if (error instanceof Error && error.message === 'PEDCARD_INSUFFICIENT_BALANCE') {
        return reply.code(400).send({
          message: 'Insufficient pedCard balance',
        });
      }

      throw error;
    }

    return reply.code(201).send(result);
  });

  app.get('/transactions/running-lines', async (request, reply) => {
    const userId = getRequestUserId(request);
    const rows = await app.repos.transaction.getRunningTransactions(userId);

    return reply.code(200).send(rows);
  });

  app.patch('/transactions/:id', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = patchTransactionParamsSchema.parse(request.params);
    const body = patchTransactionBodySchema.parse(request.body);

    try {
      const result = await transactionStatusService.patchTransaction(userId, params.id, body);
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
