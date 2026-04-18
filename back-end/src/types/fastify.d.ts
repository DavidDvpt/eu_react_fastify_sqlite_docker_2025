import type { CategoryRepository } from '../lib/repositories/categoryRepository.ts';
import type { ImageRepository } from '../lib/repositories/imageRepository.js';
import type { ItemRepository } from '../lib/repositories/itemRepository.js';
import type { LotStockRepository } from '../lib/repositories/lotStockRepository.js';
import type { SessionStatsRepository } from '../lib/repositories/sessionStatsRepository.js';
import type { TypeRepository } from '../lib/repositories/typeRepository.ts';
import type { UserRepository } from '../lib/repositories/userRepository.js';
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
