import type { SessionStatsRepository } from '../lib/repositories/index.js';
import type { FastifyInstance } from 'fastify';

type AppWithSessionStatsRepo = FastifyInstance & {
  repos: {
    sessionStats: SessionStatsRepository;
  };
};

export type { AppWithSessionStatsRepo };
