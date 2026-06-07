import { SessionService } from '../modules/index.js';

import {
  sellSessionsQuerySchema,
  updateSellLineStatusBodySchema,
  updateSellLineStatusParamsSchema,
} from './sessionRoutes.schema.js';

import type { FastifyPluginCallback, FastifyRequest } from 'fastify';

function getRequestUserId(request: FastifyRequest): string {
  const user = request.user as { id?: string } | undefined;
  if (!user?.id) {
    throw new Error('Unauthorized');
  }
  return user.id;
}

const sessionRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const sessionService = new SessionService(app.prisma);
  app.protect();

  app.get('/sessions/sell', async (request, reply) => {
    const userId = getRequestUserId(request);
    const query = sellSessionsQuerySchema.parse(request.query);
    const rows = await app.repos.transactionRepository.getSellSessions(userId, query.status);
    return reply.code(200).send(rows);
  });

  app.get('/sessions/sell/running-lines', async (request, reply) => {
    const userId = getRequestUserId(request);
    const rows = await app.repos.transactionRepository.getRunningSellLines(userId);
    return reply.code(200).send(rows);
  });

  app.patch('/sessions/sell/lines/:id/status', async (request, reply) => {
    const userId = getRequestUserId(request);
    const params = updateSellLineStatusParamsSchema.parse(request.params);
    const body = updateSellLineStatusBodySchema.parse(request.body);

    try {
      const result = await sessionService.updateSellLineStatus(userId, {
        sessionLineId: params.id,
        nextSaleStatus: body.status,
      });
      return reply.code(200).send(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'SELL_RUNNING_LINE_NOT_FOUND') {
        return reply.code(404).send({ message: 'Running sell line not found' });
      }
      if (error instanceof Error && error.message === 'SELL_LINE_LOT_NOT_FOUND') {
        return reply.code(409).send({ message: 'Sell line has no linked inventory lot' });
      }
      throw error;
    }
  });

  done();
};

export default sessionRoutes;
