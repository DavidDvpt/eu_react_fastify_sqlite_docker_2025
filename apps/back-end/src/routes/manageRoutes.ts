import typeRoutes from 'src/routes/typeRoutes.js';

import categorieRoutes from './categorieRoutes.js';
import itemRoutes from './manage/itemRoutes.js';

import type { FastifyPluginCallback } from 'fastify';

const manageRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();

  app.register(categorieRoutes, { prefix: '/categories' });
  app.register(typeRoutes, { prefix: '/types' });
  app.register(itemRoutes, { prefix: '/items' });

  done();
};

export default manageRoutes;
