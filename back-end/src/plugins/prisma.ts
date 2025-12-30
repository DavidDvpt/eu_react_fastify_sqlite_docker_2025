import fp from 'fastify-plugin';

import prismaClient from '../../prisma/prismaClient.js';

import type { FastifyPluginCallback } from 'fastify';

const prismaPlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.decorate('prisma', prismaClient);
  done();
};

export default fp(prismaPlugin, { name: 'prisma' });
