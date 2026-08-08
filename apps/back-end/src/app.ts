import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { env } from './config/env.js';
import { API_PREFIX, AUTH_PREFIX } from './config/index.js';
import { authPlugin, authorizePlugin, prismaPlugin } from './plugins/index.js';
import { authRoutes, inventoryRoutes, pedCardRoutes, transactionRoutes } from './routes/index.js';

import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { errorHandler } from '#src/plugins/errorHandler.js';
import { categoryRoutes } from '#src/routes/categoryRoutes.js';
import itemRoutes from '#src/routes/itemRoutes.js';
import typeRoutes from '#src/routes/typeRoutes.js';

const allowedOrigins = (env.CORS_ORIGIN ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

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
      if (allowedOrigins.length === 0) return cb(null, true);
      if (!requestOrigin) return cb(null, true);
      cb(null, allowedOrigins.includes(requestOrigin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(authPlugin);
  app.register(authorizePlugin);
  app.register(prismaPlugin);
  app.setErrorHandler(errorHandler);

  if (registerRoutes !== false) {
    app.register(authRoutes, { prefix: `${API_PREFIX}${AUTH_PREFIX}` });
    app.register(categoryRoutes, { prefix: `${API_PREFIX}/categories` });
    app.register(typeRoutes, { prefix: `${API_PREFIX}/types` });
    app.register(itemRoutes, { prefix: `${API_PREFIX}/items` });
    app.register(inventoryRoutes, { prefix: API_PREFIX });
    app.register(pedCardRoutes, { prefix: API_PREFIX });
    app.register(transactionRoutes, { prefix: `${API_PREFIX}/transactions` });
  }

  return app;
}
