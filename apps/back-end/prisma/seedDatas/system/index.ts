import type { Prisma } from '#prisma/generated/client.js';
import { CATEGORIES_RAW_BASE } from '#prisma/seedDatas/system/categoryRaw.js';
import { TYPES_RAW_BASE } from '#prisma/seedDatas/system/typeRaw.js';
import { ITEMS_RAW_BASE } from '#prisma/seedDatas/system/itemRaw.js';
import { USERS_RAW_BASE } from '#prisma/seedDatas/system/userRaw.js';

export const categoriesSeed = (userId: string): Prisma.CategoryCreateManyInput[] => {
  return CATEGORIES_RAW_BASE.map((c) => ({
    ...c,
    user_id: userId,
    date_created: '2025-11-23 11:59:01.5957176',
    date_updated: null,
    is_active: true,
  }));
};

export const typesSeed = (userId: string): Prisma.TypeCreateManyInput[] =>
  TYPES_RAW_BASE.map((t) => ({
    ...t,
    user_id: userId,
    date_created: '2025-11-23 11:59:01.5957176',
    date_updated: null,
    is_active: true,
    is_stackable: true,
  }));

export const itemsSeed = (userId: string): Prisma.ItemCreateManyInput[] =>
  ITEMS_RAW_BASE.map((item) => ({
    ...item,
    user_id: userId,
    date_created: '2025-11-23 11:59:01.6897533',
    date_updated: null,
    is_active: true,
    is_limited: false,
  }));

export const userSeed: Prisma.UserCreateManyInput[] = USERS_RAW_BASE.map((user) => ({
  ...user,
  date_created: '2025-11-23 11:59:01.6897533',
  date_updated: null,
  is_active: true,
}));
