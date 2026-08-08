import {
  transactionBodySchema,
  transactionQuerySchema,
  transactionCancelDtoSchema,
  transactionStatusPatchDtoSchema,
} from '@eu/zod-schemas';

import { TransactionService } from '../lib/services/prisma/transactionService.js';

import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';

const transactionRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const ts = new TransactionService(prismaClient);
  app.protect();

  app.get('/', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { status, type, itemId } = transactionQuerySchema.parse(request.query);

    const rows = await ts.getAll({ userId, status, transactionType: type, itemId });

    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { id } = request.params as { id: string };

    const row = await ts.getById({ userId, id });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = transactionBodySchema.parse(request.body);

    let result: { id: string };

    result =
      body.transactionType === 'BUY'
        ? await ts.buy({ userId, body })
        : await ts.sell({ userId, body });

    return reply.code(201).send(result);
  });

  app.patch('/:id/status', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = request.params as { id: string };
    const status = transactionStatusPatchDtoSchema.parse(request.body);

    const updated = await ts.updateStatus({ userId, id: params.id, status });

    return reply.code(200).send(updated);
  });
  app.patch('/:id/cancel', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = request.params as { id: string };
    const status = transactionCancelDtoSchema.parse(request.body);

    const cancel = await ts.cancel({ userId, id: params.id, status });

    return reply.code(200).send(cancel);
  });

  //     return reply.code(200).send(result);
  //   } catch (error) {
  //     return reply.code(400).send({ message: 'update status fails' });
  //   }
  // });

  done();
};

export default transactionRoutes;
