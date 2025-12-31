import Fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import authorizePlugin from './plugins/authorize.js';
import jwtPlugin from './plugins/jwt.js';
import prismaPlugin from './plugins/prisma.js';
import repositoryPlugin from './plugins/repositories.js';
import authRoutes from './routes/authRoutes.js';

export function buildApp({
  logger = true,
  registerRoutes = true,
}: {
  logger?: boolean;
  registerRoutes?: boolean;
}) {
  const app = Fastify({
    logger,
  }).withTypeProvider<ZodTypeProvider>();

  app.register(jwtPlugin);
  app.register(authorizePlugin);
  app.register(prismaPlugin);
  app.register(repositoryPlugin);

  if (registerRoutes !== false) {
    app.register(authRoutes, { prefix: '/auth' });
  }
  // app.register(authRoutes, { prefix: '/auth' });

  return app;
}
