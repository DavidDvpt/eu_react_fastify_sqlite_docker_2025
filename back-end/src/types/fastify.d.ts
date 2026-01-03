import { FastifyJwtVerifyOptions } from '@fastify/jwt';
import 'fastify';

type PrismaClientType = typeof import('../../prisma/prismaClient.js').default;

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClientType;

    jwt: {
      access: {
        sign: (payload: object) => string;
        verify: <T = unknown>(token: string) => T;
      };
      refresh: {
        sign: (payload: object) => string;
        verify: <T = unknown>(token: string) => T;
      };
    };

    authenticate: (request: FastifyRequest, reply: import('fastify').FastifyReply) => Promise<void>;
    authenticateRefresh: (
      request: FastifyRequest,
      reply: import('fastify').FastifyReply
    ) => Promise<void>;

    authorize: (
      allowedRoles: string[]
    ) => (request: FastifyRequest, reply: import('fastify').FastifyReply) => void;
  }

  interface FastifyRequest {
    user: unknown;
    jwtVerify: (
      opts?: FastifyJwtVerifyOptions & { namespace?: 'access' | 'refresh' }
    ) => Promise<void>;
  }
}
