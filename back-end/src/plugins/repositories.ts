import fp from 'fastify-plugin';

import {
  CategoryRepository,
  ItemRepository,
  LotStockRepository,
  TransactionRepository,
  TypeRepository,
  UserRepository,
} from '../lib/repositories/index.js';

import type { FastifyPluginCallback } from 'fastify';

const repositoriesPlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.decorate('repos', {
    users: new UserRepository(app.prisma),
    categories: new CategoryRepository(app.prisma),
    types: new TypeRepository(app.prisma),
    items: new ItemRepository(app.prisma),
    lotStock: new LotStockRepository(app.prisma),
    transactionRepository: new TransactionRepository(app.prisma),
  });

  done();
};

export default fp(repositoriesPlugin, {
  name: 'repositories',
  dependencies: ['prisma'],
});
