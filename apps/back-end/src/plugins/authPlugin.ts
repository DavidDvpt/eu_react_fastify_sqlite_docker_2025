import jwt from '@fastify/jwt'; // ton module .env/.envSchema
import fp from 'fastify-plugin';

import { env } from '../config/env.js';
import { parseDurationToSeconds } from '../lib/auth/index.js';

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const authPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  const ACCESS_SECRET = env.JWT_ACCESS_SECRET;
  const REFRESH_SECRET = env.JWT_REFRESH_SECRET;

  const ACCESS_EXPIRES_IN = env.JWT_ACCESS_EXPIRES_IN;
  const REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;

  // Validate env values at startup so JWT signing and cookie TTL stay aligned.
  parseDurationToSeconds(ACCESS_EXPIRES_IN);
  parseDurationToSeconds(REFRESH_EXPIRES_IN);

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

  app.decorate('adminProtect', function (this: FastifyInstance) {
    this.addHook('preHandler', async (request, reply) => {
      const user = request.user;

      if (user.role !== 'ADMIN') {
        return reply.code(403).send({ message: 'Not authorized' });
      }
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
