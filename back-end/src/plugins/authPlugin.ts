import jwt from '@fastify/jwt'; // ton module .env/.envSchema
import fp from 'fastify-plugin';

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const authPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ACCESS
  await app.register(jwt, {
    secret: ACCESS_SECRET,
    namespace: 'access',
    cookie: {
      cookieName: 'access_token',
      signed: false,
    },
    sign: { expiresIn: ACCESS_EXPIRES_IN },
  });

  // REFRESH
  await app.register(jwt, {
    secret: REFRESH_SECRET,
    namespace: 'refresh',
    sign: { expiresIn: REFRESH_EXPIRES_IN },
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.accessJwtVerify({
        onlyCookie: true,
      });

      const { sub, role, pseudo } = request.user as unknown as {
        sub: string;
        role: string;
        pseudo: string;
      };

      request.user = { id: sub, role, pseudo };

      return;
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  app.decorate('protect', function (this: FastifyInstance) {
    this.addHook('preHandler', async (request, reply) => {
      return this.authenticate(request, reply);
    });
  });

  app.decorate('authenticateRefresh', async (request) => {
    await request.refreshVerify({ onlyCookie: true });
  });

  app.decorate('accessSign', (user) => {
    return app.jwt.access.sign({
      sub: user.id,
      role: user.role,
      pseudo: user.pseudo,
    });
  });

  app.decorate('refreshSign', (user) => {
    return app.jwt.refresh.sign({
      sub: user.id,
      role: user.role,
      pseudo: user.pseudo,
    });
  });
};

export default fp(authPlugin, { name: 'auth' });
