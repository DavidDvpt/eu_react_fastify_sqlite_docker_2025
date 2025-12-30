import Fastify from 'fastify';

import authorizePlugin from './plugins/authorize.js';
import jwtPlugin from './plugins/jwt.js';
export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(jwtPlugin);
  app.register(authorizePlugin);

  app.get('/api/health', async () => {
    return Promise.resolve({ status: 'ok' });
  });

  return app;
}
