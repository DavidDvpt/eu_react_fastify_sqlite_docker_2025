import fp from 'fastify-plugin';

import { ImageRepository } from '../lib/repositories/imageRepository.js';
import { ItemCategoryRepository } from '../lib/repositories/itemCategoryRepository.js';
import { ItemRepository } from '../lib/repositories/itemRepository.js';
import { ItemTypeRepository } from '../lib/repositories/itemTypeRepository.js';
import { LotStockRepository } from '../lib/repositories/lotStockRepository.js';
import { SessionStatsRepository } from '../lib/repositories/sessionStatsRepository.js';
import { UserRepository } from '../lib/repositories/userRepository.js';

import type { FastifyPluginCallback } from 'fastify';

const repositoriesPlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.decorate('repos', {
    images: new ImageRepository(),
    users: new UserRepository(app.prisma),
    itemCategories: new ItemCategoryRepository(app.prisma),
    itemTypes: new ItemTypeRepository(app.prisma),
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
