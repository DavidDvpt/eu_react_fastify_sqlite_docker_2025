import fp from 'fastify-plugin';

import { CategoryRepository } from '../lib/repositories/categoryRepository.js';
import { ImageRepository } from '../lib/repositories/imageRepository.js';
import { ItemRepository } from '../lib/repositories/itemRepository.js';
import { LotStockRepository } from '../lib/repositories/lotStockRepository.js';
import { SessionStatsRepository } from '../lib/repositories/sessionStatsRepository.js';
import { TypeRepository } from '../lib/repositories/typeRepository.js';
import { UserRepository } from '../lib/repositories/userRepository.js';

import type { FastifyPluginCallback } from 'fastify';

const repositoriesPlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.decorate('repos', {
    images: new ImageRepository(),
    users: new UserRepository(app.prisma),
    itemCategories: new CategoryRepository(app.prisma),
    itemTypes: new TypeRepository(app.prisma),
    items: new ItemRepository(app.prisma),
    lotStock: new LotStockRepository(app.prisma),
    sessionStats: new SessionStatsRepository(app.prisma),
  });

  done();
};

export default fp(repositoriesPlugin, {
  name: 'repositories',
  dependencies: ['prisma'],
});
