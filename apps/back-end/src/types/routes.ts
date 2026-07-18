import type { TransactionRepository } from '../lib/repositories/index.js';
import type { FastifyInstance } from 'fastify';

type AppWithTransactionStatsRepo = FastifyInstance & {
  repos: {
    transactionRepository: TransactionRepository;
  };
};

export type { AppWithTransactionStatsRepo };
