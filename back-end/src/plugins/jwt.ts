/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt from '@fastify/jwt'; // ton module .env/.envSchema
import 'dotenv/config';
import fp from 'fastify-plugin';

import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const jwtPlugin: FastifyPluginAsync = async (app) => {
  // Access token
  await app.register(jwt, {
    secret: ACCESS_SECRET,
    sign: { expiresIn: ACCESS_EXPIRES_IN ?? '15m' },
    namespace: 'access',
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      const auth = request.headers.authorization;
      if (!auth?.startsWith('Bearer ')) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }

      const token = auth.slice('Bearer '.length);

      const payload = app.jwt.access.verify(token);
      (request as any).user = payload; // pour authorize
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  // Refresh token
  await app.register(jwt, {
    secret: REFRESH_SECRET,
    sign: { expiresIn: REFRESH_EXPIRES_IN ?? '7d' },
    namespace: 'refresh',
  });

  app.decorate('authenticateRefresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify({ namespace: 'refresh' } as any);
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });
};

export default fp(jwtPlugin, { name: 'authenticate' });
