import { pedcardFormSchema } from '@eu/zod-schemas';

import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import { PedcardService } from '#src/lib/services/pedcardService.js';

const pedCardRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();

  app.get('/pedcard/check', async (request, reply) => {
    const userId = getRequestUserId(request);
    const hasInitialBalance = await PedcardService.hasInitialBalance(userId);

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
    const balance = await PedcardService.getBalance(userId);

    return reply.code(200).send({
      balance,
    });
  });

  app.get('/pedcard/canPay', async (request, reply) => {
    const { value } = request.query as { value?: string };

    const userId = getRequestUserId(request);

    const canPay = await PedcardService.canPay(userId, Number(value));

    return reply.code(200).send({
      canPay,
    });
  });

  app.post('/pedcard', async (request, reply) => {
    const userId = getRequestUserId(request);
    const body = pedcardFormSchema.parse(request.body);

    await PedcardService.create({
      userId,
      transactionId: body.transactionId,
      type: body.type,
      value: body.value,
    });

    return reply.code(201).send();
  });

  app.patch('/pedcard/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const userId = getRequestUserId(request);
    const body = pedcardFormSchema.parse(request.body);

    await PedcardService.create({
      userId,
      transactionId: body.transactionId,
      type: body.type,
      value: body.value,
    });

    return reply.code(201).send();
  });

  done();
};

export default pedCardRoutes;
