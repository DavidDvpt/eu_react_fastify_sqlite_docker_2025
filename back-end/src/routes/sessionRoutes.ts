import { sellSessionsQuerySchema } from './sessionRoutes.schema.js';

import type { AppWithSessionStatsRepo } from '../types/routes.js';
import type { FastifyPluginCallback, FastifyRequest } from 'fastify';

function getRequestUserId(request: FastifyRequest): string {
  const user = request.user as { id?: string } | undefined;
  if (!user?.id) {
    throw new Error('Unauthorized');
  }
  return user.id;
}

const sessionRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const sessionApp = app as AppWithSessionStatsRepo;
  app.protect();

  app.get('/sessions/sell', async (request, reply) => {
    const userId = getRequestUserId(request);
    const query = sellSessionsQuerySchema.parse(request.query);
    const rows = await sessionApp.repos.sessionStats.getSellSessions(userId, query.status);
    return reply.code(200).send(rows);
  });

  app.get('/sessions/sell/running-lines', async (request, reply) => {
    const userId = getRequestUserId(request);
    const rows = await sessionApp.repos.sessionStats.getRunningSellLines(userId);
    return reply.code(200).send(rows);
  });

  done();
};

export default sessionRoutes;
