export type PrismaClientType = typeof import('../../prisma/prismaClient.js').default;

export type UserForToken = {
  id: string;
  role: string;
  pseudo: string;
};

export type JwtVerifyOpts = {
  onlyCookie?: boolean;
  cookieName?: string;
  onlyHeader?: boolean;
};
