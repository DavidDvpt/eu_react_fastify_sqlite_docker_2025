import type { TransactionRepository } from '../lib/repositories/index.js';
import type { FastifyInstance } from 'fastify';

type AppWithTransactionStatsRepo = FastifyInstance & {
  repos: {
    transaction: TransactionRepository;
  };
};

export type { AppWithTransactionStatsRepo };
