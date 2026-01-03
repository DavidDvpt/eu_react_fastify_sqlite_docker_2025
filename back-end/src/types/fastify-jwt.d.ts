import '@fastify/jwt';

type JwtNs = {
  sign: (payload: object) => string;
  verify: <T = unknown>(token: string) => T;
};

declare module '@fastify/jwt' {
  interface JWT {
    access: JwtNs;
    refresh: JwtNs;
  }
  interface FastifyJWT {
    payload: { sub: string; role?: string };
    user: { sub: string; role?: string };
  }
}
