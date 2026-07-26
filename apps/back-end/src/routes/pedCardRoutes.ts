import { pedcardFormSchema } from '@eu/zod-schemas';

import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { PedcardService } from '#src/lib/services/pedcardService.js';

const pedCardRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const ps = new PedcardService(prismaClient);
  app.protect();

  app.get('/pedcard/check', async (request, reply) => {
    const userId = getRequestUserId(request);
    const hasInitialBalance = await ps.hasInitialBalance({ userId });

    if (!hasInitialBalance) {
      return reply.code(400).send({
        message: 'PedCard must be initialized',
      });
    }

    return reply.code(200).send({
      message: 'PedCard initialized',
    });
  });

  app.get('/pedcard/balance', async (request, reply) => {
    const userId = getRequestUserId(request);
    const balance = await ps.getBalance({ userId });

    return reply.code(200).send({
      balance,
    });
  });

  app.get('/pedcard/canPay', async (request, reply) => {
    const { value } = request.query as { value?: string };

    const userId = getRequestUserId(request);

    const canPay = await ps.canPay({ userId, value: Number(value) });

    return reply.code(200).send({
      canPay,
    });
  });

  app.post('/pedcard', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = pedcardFormSchema.parse(request.body);

    await ps.create({
      userId,
      body: { transactionId: body.transactionId, type: body.type, value: body.value },
    });

    return reply.code(201).send();
  });

  app.patch('/pedcard/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const userId = getRequestUserId(request);
    const body = pedcardFormSchema.parse(request.body);

    await ps.update({
      userId,
      id: params.id,
      body: { type: body.type, value: body.value },
    });

    return reply.code(201).send();
  });

  done();
};

export default pedCardRoutes;
