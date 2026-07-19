import fp from 'fastify-plugin';

import {
  LotRepository,
  LotStockRepository,
  TransactionRepository,
  UserRepository,
} from '../lib/repositories/index.js';

import type { FastifyPluginCallback } from 'fastify';

const repositoriesPlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.decorate('repos', {
    users: new UserRepository(app.prisma),
    lotStock: new LotStockRepository(app.prisma),
    lot: new LotRepository(app.prisma),
    transaction: new TransactionRepository(app.prisma),
  });

  done();
};

export default fp(repositoriesPlugin, {
  name: 'repositories',
  dependencies: ['prisma'],
});
