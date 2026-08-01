import {
  transactionBodySchema,
  transactionQuerySchema,
  transactionStatusBodySchema,
} from '@eu/zod-schemas';

import { TransactionService } from '../lib/services/prisma/transactionService.js';

import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';

const transactionRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const ts = new TransactionService(prismaClient);
  app.protect();

  app.get('/transactions', async (request, reply) => {
    const userId = getRequestUserId(request);
    const query = transactionQuerySchema.parse(request.query);

    const rows = await ts.getAll({ userId, whereOptions: query });

    return reply.code(200).send(rows);
  });

  app.post('/transactions', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = transactionBodySchema.parse(request.body);

    let result: { id: string };

    result =
      body.transactionType === 'BUY'
        ? await ts.buy({ userId, body })
        : await ts.sell({ userId, body });

    return reply.code(201).send(result);
  });

  app.patch('/transactions/:id/status', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = request.params as { id: string };
    const body = transactionStatusBodySchema.parse(request.body);

    try {
      const result = await ts.updateStatus({ userId, id: params.id, body });

      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ message: 'update status fails' });
    }
  });

  done();
};

export default transactionRoutes;
