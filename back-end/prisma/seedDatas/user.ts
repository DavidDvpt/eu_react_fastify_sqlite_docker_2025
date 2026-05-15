// Auto-generated from datas.sql
import HashTools from '../../src/lib/security/HashTools.js';
import { env } from '../../src/config/env.js';
import type { Prisma } from '../generated/client.js';

export const SYSTEM_USER: Prisma.UserCreateManyInput = {
  id: env.SYSTEM_USER_ID ?? '',
  firstname: 'System',
  lastname: 'User',
  pseudo: env.SYSTEM_USER_PSEUDO ?? '',
  email: env.SYSTEM_USER_EMAIL ?? '',
  password_hash: await HashTools.hashPassword(env.SYSTEM_USER_PASSWORD ?? ''),
  role: 'ADMIN',
  date_created: '2026-04-13 00:00:00.000',
  date_updated: null,
  is_active: true,
};

export const DEV_USERS: Prisma.UserCreateManyInput[] = [
  {
    id: env.DEV_DATA_USER_ID ?? '',
    firstname: 'Lucien',
    lastname: 'User',
    pseudo: env.DEV_DATA_USER_LOGIN ?? '',
    email: env.DEV_DATA_USER_EMAIL ?? '',
    password_hash: await HashTools.hashPassword(env.DEV_DATA_USER_PASSWORD ?? ''),
    role: 'USER',
    date_created: '2025-11-23 10:59:01.126532',
    date_updated: null,
    is_active: true,
  },
  {
    id: env.DEV_ADMIN_ID ?? '',
    firstname: 'David',
    lastname: 'Admin',
    pseudo: env.DEV_ADMIN_PSEUDO ?? '',
    email: env.DEV_ADMIN_EMAIL ?? '',
    password_hash: await HashTools.hashPassword(env.DEV_ADMIN_PASSWORD ?? ''),
    role: 'ADMIN',
    date_created: '2025-11-23 10:59:01.1264783',
    date_updated: null,
    is_active: true,
  },
] as const;

export const USERS: Prisma.UserCreateManyInput[] = [SYSTEM_USER, ...DEV_USERS];
