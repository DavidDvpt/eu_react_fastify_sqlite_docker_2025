// src/types/fastify.d.ts
import 'fastify';

type PrismaClientType = typeof import('../../prisma/prismaClient.js').default;

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClientType;
  }
}
