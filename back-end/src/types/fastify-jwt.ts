import '@fastify/jwt';
import type { UserForToken } from './fastify.js';

type JwtNamespace = {
  sign: (payload: { sub: string; role?: string; pseudo?: string }) => string;
  verify: <T = unknown>(token: string) => T;
};

type JwtPayload = { sub: string; role?: string; pseudo?: string };

declare module '@fastify/jwt' {
  interface JWT {
    access: JwtNamespace;
    refresh: JwtNamespace;
  }
  interface FastifyJWT {
    payload: JwtPayload;
    user: UserForToken;
  }
}

export type { JwtNamespace, JwtPayload };
