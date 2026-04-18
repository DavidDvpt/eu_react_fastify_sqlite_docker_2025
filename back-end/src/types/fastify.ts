import type {
  CategoryRepository,
  ImageRepository,
  ItemRepository,
  LotStockRepository,
  SessionStatsRepository,
  TypeRepository,
  UserRepository,
} from '../lib/repositories/index.js';
import type { preHandlerHookHandler, preHandlerAsyncHookHandler, FastifyReply } from 'fastify';

type PrismaClientType = typeof import('../../prisma/prismaClient.js').default;

type UserForToken = {
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
    repos: {
      images: ImageRepository;
      users: UserRepository;
      itemCategories: CategoryRepository;
      itemTypes: TypeRepository;
      items: ItemRepository;
      lotStock: LotStockRepository;
      sessionStats: SessionStatsRepository;
    };

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

export type { PrismaClientType, UserForToken, JwtVerifyOpts };
