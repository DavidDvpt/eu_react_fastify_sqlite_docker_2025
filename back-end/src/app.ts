import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import 'dotenv/config';
import Fastify from 'fastify';
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import authorizePlugin from './plugins/authorize.js';
import jwtPlugin from './plugins/jwt.js';
import prismaPlugin from './plugins/prisma.js';
import repositoryPlugin from './plugins/repositories.js';
import authRoutes from './routes/authRoutes.js';

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

  app.register(jwtPlugin);
  app.register(authorizePlugin);
  app.register(prismaPlugin);
  app.register(repositoryPlugin);

  if (registerRoutes !== false) {
    // public
    app.register(authRoutes, { prefix: '/auth' });
  }

  return app;
}
