import type { JwtVerifyOpts, PrismaClientType, UserForToken } from './fastify.ts';
import type {
  LotStockRepository,
  PedCardRepository,
  TransactionRepository,
  UserRepository,
  LotRepository,
} from '../lib/repositories/index.ts';
import type { preHandlerAsyncHookHandler, preHandlerHookHandler, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClientType;
    repos: {
      users: UserRepository;
      lotStock: LotStockRepository;
      lot: LotRepository;
      pedCard: PedCardRepository;
      transaction: TransactionRepository;
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
    user?: UserForToken;
    accessJwtVerify: (options?: JwtVerifyOpts) => Promise<void>;
    refreshVerify: (options?: JwtVerifyOpts) => Promise<void>;
  }
}
