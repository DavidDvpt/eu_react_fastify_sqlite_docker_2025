import Fastify from 'fastify';

import jwtPlugin from './plugins/jwt.js';
export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(jwtPlugin);

  app.get('/api/health', async () => {
    return Promise.resolve({ status: 'ok' });
  });

  return app;
}
