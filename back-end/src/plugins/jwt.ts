import jwt from '@fastify/jwt'; // ton module .env/.envSchema
import 'dotenv/config';
import fp from 'fastify-plugin';

import type { FastifyPluginAsync } from 'fastify';

const SECRET = process.env.JWT_SECRET || '';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '';

const jwtPlugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: SECRET,
    sign: { expiresIn: EXPIRES_IN ?? '15m' },
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });
};

export default fp(jwtPlugin, { name: 'authenticate' });
