// Auto-generated from datas.sql
import HashTools from '../../src/lib/security/HashTools.js';
import type { Prisma } from '../generated/client.js';
import {
  SYSTEM_USER_EMAIL,
  SYSTEM_USER_ID,
  SYSTEM_USER_PASSWORD,
  SYSTEM_USER_PSEUDO,
  DEV_DATA_USER_EMAIL,
  DEV_DATA_USER_ID,
  DEV_DATA_USER_LOGIN,
  DEV_DATA_USER_PASSWORD,
  DEV_ADMIN_ID,
  DEV_ADMIN_PSEUDO,
  DEV_ADMIN_EMAIL,
  DEV_ADMIN_PASSWORD,
} from './systemUser.js';

export const USERS: Prisma.UserCreateManyInput[] = [
  {
    id: SYSTEM_USER_ID,
    firstname: 'System',
    lastname: 'User',
    pseudo: SYSTEM_USER_PSEUDO,
    email: SYSTEM_USER_EMAIL,
    password_hash: await HashTools.hashPassword(SYSTEM_USER_PASSWORD),
    role: 'ADMIN',
    date_created: '2026-04-13 00:00:00.000',
    date_updated: null,
    is_active: true,
  },
  {
    id: DEV_DATA_USER_ID,
    firstname: 'Lucien',
    lastname: 'User',
    pseudo: DEV_DATA_USER_LOGIN,
    email: DEV_DATA_USER_EMAIL,
    password_hash: await HashTools.hashPassword(DEV_DATA_USER_PASSWORD),
    role: 'USER',
    date_created: '2025-11-23 10:59:01.126532',
    date_updated: null,
    is_active: true,
  },
  {
    id: DEV_ADMIN_ID,
    firstname: 'David',
    lastname: 'Admin',
    pseudo: DEV_ADMIN_PSEUDO,
    email: DEV_ADMIN_EMAIL,
    password_hash: await HashTools.hashPassword(DEV_ADMIN_PASSWORD),
    role: 'ADMIN',
    date_created: '2025-11-23 10:59:01.1264783',
    date_updated: null,
    is_active: true,
  },
] as const;
