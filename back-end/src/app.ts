import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import 'dotenv/config';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import authorizePlugin from './plugins/authorize.js';
import authPlugin from './plugins/authPlugin.js';
import prismaPlugin from './plugins/prisma.js';
import repositoryPlugin from './plugins/repositories.js';
import authRoutes from './routes/authRoutes.js';

import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const origin = process.env.CORS_ORIGIN;

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

  app.register(cookie);

  app.register(cors, {
    origin: (requestOrigin, cb) => {
      if (!origin) return cb(null, true);
      if (!requestOrigin) return cb(null, true);
      cb(null, requestOrigin === origin);
    },
    credentials: true,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(authPlugin);
  app.register(authorizePlugin);
  app.register(prismaPlugin);
  app.register(repositoryPlugin);

  if (registerRoutes !== false) {
    // public
    app.register(authRoutes, { prefix: '/auth' });
  }

  return app;
}
