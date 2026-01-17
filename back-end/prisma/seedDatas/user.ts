// Auto-generated from datas.sql
import HashTools from '../../src/lib/security/HashTools.js';
import type { Prisma } from '../generated/client.js';

export const USERS: Prisma.UserCreateManyInput[] = [
  {
    id: '0FB0E33F-424C-4A2A-A135-FFF8A2D81E5E',
    firstname: 'Lucien',
    lastname: 'User',
    pseudo: 'useruser',
    email: 'user@user.user',
    password_hash: await HashTools.hashPassword('useruser'),
    role: 'USER',
    date_created: '2025-11-23 10:59:01.126532',
    date_updated: null,
    is_active: true,
  },
  {
    id: '1947DAFD-0CA4-4673-8F25-EB4702265ACA',
    firstname: 'David',
    lastname: 'Admin',
    pseudo: 'adminadmin',
    email: 'admn@admin.admin',
    password_hash: await HashTools.hashPassword('adminadmin'),
    role: 'ADMIN',
    date_created: '2025-11-23 10:59:01.1264783',
    date_updated: null,
    is_active: true,
  },
] as const;
