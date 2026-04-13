import { sellSessionsQuerySchema } from './sessionRoutes.schema.js';

import type { SessionStatsRepository } from '../lib/repositories/sessionStatsRepository.js';
import type { FastifyInstance, FastifyPluginCallback, FastifyRequest } from 'fastify';

type AppWithSessionStatsRepo = FastifyInstance & {
  repos: {
    sessionStats: SessionStatsRepository;
  };
};

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

  done();
};

export default sessionRoutes;
