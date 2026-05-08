import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import './config/env.js';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { API_PREFIX, AUTH_PREFIX } from './config/index.js';
import { authPlugin, authorizePlugin, prismaPlugin, repositoryPlugin } from './plugins/index.js';
import {
  authRoutes,
  imageRoutes,
  manageRoutes,
  sessionRoutes,
  inventoryRoutes,
} from './routes/index.js';

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
    app.register(authRoutes, { prefix: `${API_PREFIX}${AUTH_PREFIX}` });
    app.register(imageRoutes, { prefix: API_PREFIX });
    app.register(manageRoutes, { prefix: API_PREFIX });
    app.register(inventoryRoutes, { prefix: API_PREFIX });
    app.register(sessionRoutes, { prefix: API_PREFIX });
  }

  return app;
}
