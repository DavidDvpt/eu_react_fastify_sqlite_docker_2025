import { StocksService, TransactionService } from '../modules/index.js';
import { TransactionStatusService } from '../modules/transactionStatus/index.js';

import {
  transactionBodySchema,
  updateTransactionLineStatusBodySchema,
  updateTransactionLineStatusParamsSchema,
} from './transactionRoutes.schema.js';
import { getRequestUserId } from './utils.js';

import type { TransactionExecutionResult } from '../types/index.js';
import type { FastifyPluginCallback } from 'fastify';

const transactionRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const stocksService = new StocksService(app.repos.lotStock);
  const transactionService = new TransactionService(app.prisma, stocksService);
  const transactionStatusService = new TransactionStatusService(app.prisma);
  app.protect();

  app.post('/transactions', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = transactionBodySchema.parse(request.body);

    let result: TransactionExecutionResult;
    try {
      result =
        body.type === 'buy'
          ? await transactionService.buy(userId, body.lines)
          : await transactionService.sell(userId, body.lines);
    } catch (error) {
      if (error instanceof Error && error.message === 'PEDCARD_INSUFFICIENT_BALANCE') {
        return reply.code(400).send({
          message: 'Insufficient pedCard balance',
        });
      }

      throw error;
    }

    if (!result.processed.length) {
      const message =
        body.type === 'buy' ? 'No buy line could be processed' : 'No sell line could be processed';
      return reply.code(400).send({
        message,
        ...result,
      });
    }

    return reply.code(result.rejected.length ? 207 : 201).send(result);
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
