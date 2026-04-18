import type { JwtVerifyOpts, PrismaClientType, UserForToken } from './fastify.js';
import type {
  CategoryRepository,
  ImageRepository,
  ItemRepository,
  LotStockRepository,
  SessionStatsRepository,
  TypeRepository,
  UserRepository,
} from '../lib/repositories/index.js';
import type { preHandlerAsyncHookHandler, preHandlerHookHandler, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClientType;
    repos: {
      images: ImageRepository;
      users: UserRepository;
      categories: CategoryRepository;
      types: TypeRepository;
      items: ItemRepository;
      lotStock: LotStockRepository;
      sessionStats: SessionStatsRepository;
    };

    authenticate: preHandlerAsyncHookHandler;
    authenticateRefresh: preHandlerAsyncHookHandler;
    protect: (this: FastifyInstance) => void;

    authorize: (allowedRoles: string[]) => preHandlerHookHandler;

    accessSign: (user: UserForToken) => string;
    refreshSign: (user: UserForToken) => string;

    setAuthCookies: (reply: FastifyReply, user: UserForToken) => void;
    clearAuthCookies: (reply: FastifyReply) => void;
  }

  interface FastifyRequest {
    accessJwtVerify: (options?: JwtVerifyOpts) => Promise<void>;
    refreshVerify: (options?: JwtVerifyOpts) => Promise<void>;
  }
}
