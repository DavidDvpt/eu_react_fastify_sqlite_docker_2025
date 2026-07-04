import { getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

const pedCardRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();

  app.get('/pedcard/check', async (request, reply) => {
    const userId = getRequestUserId(request);
    const hasInitialBalance = await app.repos.pedCard.hasInitialBalance(userId);

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
    const balance = await app.repos.pedCard.getBalance(userId);

    return reply.code(200).send({
      balance,
    });
  });

  done();
};

export default pedCardRoutes;
