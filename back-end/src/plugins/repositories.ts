import fp from 'fastify-plugin';

import { ItemCategoryRepository } from '../lib/repositories/itemCategoryRepository.js';
import { ItemRepository } from '../lib/repositories/itemRepository.js';
import { ItemTypeRepository } from '../lib/repositories/itemTypeRepository.js';
import { UserRepository } from '../lib/repositories/userRepository.js';

import type { FastifyPluginCallback } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    repos: {
      users: UserRepository;
      itemCategories: ItemCategoryRepository;
      itemTypes: ItemTypeRepository;
      items: ItemRepository;
    };
  }
}

const repositoriesPlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.decorate('repos', {
    users: new UserRepository(app.prisma),
    itemCategories: new ItemCategoryRepository(app.prisma),
    itemTypes: new ItemTypeRepository(app.prisma),
    items: new ItemRepository(app.prisma),
  });

  done();
};

export default fp(repositoriesPlugin, {
  name: 'repositories',
  dependencies: ['prisma'],
});
