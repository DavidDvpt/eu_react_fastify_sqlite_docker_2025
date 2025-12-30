import Fastify from 'fastify';

import authorizePlugin from './plugins/authorize.js';
import jwtPlugin from './plugins/jwt.js';
import prismaPlugin from './plugins/prisma.js';

export function buildApp(opts?: { logger?: boolean }) {
  const app = Fastify({
    logger: opts?.logger ?? true,
  });

  app.register(jwtPlugin);
  app.register(authorizePlugin);
  app.register(prismaPlugin);

  app.get('/api/health', async () => {
    return Promise.resolve({ status: 'ok' });
  });

  return app;
}
