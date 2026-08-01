// Auto-generated from datas.sql
import HashTools from '../../../src/lib/security/HashTools.js';
import { env } from '../../../src/config/env.js';
import type { Prisma } from '#prisma/generated/client.js';

type SYSTEM_USER_TYPE = Omit<
  Prisma.UserCreateManyInput,
  'date_created' | 'date_updated' | 'is_active'
>;

const SYSTEM_USER: SYSTEM_USER_TYPE = {
  id: env.SYSTEM_USER_ID ?? '',
  firstname: 'System',
  lastname: 'User',
  pseudo: env.SYSTEM_USER_PSEUDO ?? '',
  email: env.SYSTEM_USER_EMAIL ?? '',
  password_hash: await HashTools.hashPassword(env.SYSTEM_USER_PASSWORD ?? ''),
  role: 'ADMIN',
};

const DEV_USERS: SYSTEM_USER_TYPE[] = [
  {
    id: env.DEV_DATA_USER_ID ?? '',
    firstname: 'Lucien',
    lastname: 'User',
    pseudo: env.DEV_DATA_USER_LOGIN ?? '',
    email: env.DEV_DATA_USER_EMAIL ?? '',
    password_hash: await HashTools.hashPassword(env.DEV_DATA_USER_PASSWORD ?? ''),
    role: 'USER',
  },
  {
    id: env.DEV_ADMIN_ID ?? '',
    firstname: 'David',
    lastname: 'Admin',
    pseudo: env.DEV_ADMIN_PSEUDO ?? '',
    email: env.DEV_ADMIN_EMAIL ?? '',
    password_hash: await HashTools.hashPassword(env.DEV_ADMIN_PASSWORD ?? ''),
    role: 'ADMIN',
  },
] as const;

export const USERS_RAW_BASE: SYSTEM_USER_TYPE[] = [SYSTEM_USER, ...DEV_USERS];
