import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from './generated/client.js';
import { env } from '../src/config/env.js';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
const prismaClient = new PrismaClient({ adapter });

export default prismaClient;

export type DatabaseClient = Prisma.TransactionClient;
export type RootDatabaseClient = typeof prismaClient;
