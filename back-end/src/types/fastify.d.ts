import type { ImageRepository } from '../lib/repositories/imageRepository.js';
import type { ItemCategoryRepository } from '../lib/repositories/itemCategoryRepository.js';
import type { ItemRepository } from '../lib/repositories/itemRepository.js';
import type { ItemTypeRepository } from '../lib/repositories/itemTypeRepository.js';
import type { LotStatsRepository } from '../lib/repositories/lotStatsRepository.js';
import type { SessionStatsRepository } from '../lib/repositories/sessionStatsRepository.js';
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
      itemCategories: ItemCategoryRepository;
      itemTypes: ItemTypeRepository;
      items: ItemRepository;
      lotStats: LotStatsRepository;
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
