import type { FastifyPluginCallback } from 'fastify';

import { categoryRoutes } from '#src/routes/categoryRoutes.js';
import itemRoutes from '#src/routes/itemRoutes.js';
import typeRoutes from '#src/routes/typeRoutes.js';

export const systemRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();

  app.register(categoryRoutes, { prefix: '/categories' });
  app.register(typeRoutes, { prefix: '/types' });
  app.register(itemRoutes, { prefix: '/items' });

  done();
};
