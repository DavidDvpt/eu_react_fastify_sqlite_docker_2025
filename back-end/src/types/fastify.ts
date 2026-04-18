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

export type { PrismaClientType, UserForToken, JwtVerifyOpts };
