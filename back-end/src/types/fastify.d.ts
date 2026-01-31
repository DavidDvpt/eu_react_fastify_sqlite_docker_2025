import type { preHandlerHookHandler, preHandlerAsyncHookHandler, FastifyReply } from 'fastify';

type PrismaClientType = typeof import('../../prisma/prismaClient.js').default;

export type UserForToken = {
  id: string;
  role: string;
  pseudo: string;
};

type JwtVerifyOpts = {
  onlyCookie?: boolean;
  cookieName?: string;
  onlyHeader?: boolean;
};

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClientType;

    authenticate: preHandlerAsyncHookHandler;
    authenticateRefresh: preHandlerAsyncHookHandler;
    protect: (this: FastifyInstance) => void;

    authorize: (allowedRoles: string[]) => preHandlerHookHandler;

    // jwt helpers (sign)
    accessSign: (user: UserForToken) => string;
    refreshSign: (user: UserForToken) => string;

    // cookies helpers
    setAuthCookies: (reply: FastifyReply, user: UserForToken) => void;
    clearAuthCookies: (reply: FastifyReply) => void;
  }

  interface FastifyRequest {
    accessJwtVerify: (options?: JwtVerifyOpts) => Promise<void>;
    refreshVerify: (options?: JwtVerifyOpts) => Promise<void>;
  }
}
