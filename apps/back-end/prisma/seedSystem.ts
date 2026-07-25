import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { env } from '../src/config/env.js';
import prismaClient from './prismaClient.js';
import { ITEM_CATEGORIES } from './seedDatas/item_categories.js';
import { ITEM_TYPES } from './seedDatas/item_types.js';
import { ITEMS } from './seedDatas/items.js';
import { SYSTEM_USER } from './seedDatas/user.js';
import { TypesService } from '#src/lib/services/typeService.js';
import { ItemService } from '#src/lib/services/itemService.js';

const prismaCategory = prismaClient.category;
const prismaType = new TypesService();
const prismaItem = new ItemService();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const installSessionLineSoldedArchiveTrigger = async () => {
  const distSqlPath = join(__dirname, 'sqlFiles', 'sessionLineSoldedArchiveTrigger.sql');
  const sourceSqlPath = join(
    __dirname,
    '..',
    '..',
    'prisma',
    'sqlFiles',
    'sessionLineSoldedArchiveTrigger.sql'
  );

  let triggerSql: string;
  try {
    triggerSql = await readFile(distSqlPath, 'utf-8');
  } catch {
    triggerSql = await readFile(sourceSqlPath, 'utf-8');
  }
  const statements = triggerSql
    .split('\n-- @statement-break\n')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

  for (const statement of statements) {
    await prismaClient.$executeRawUnsafe(statement);
  }
};

const seedSystemData = async () => {
  await installSessionLineSoldedArchiveTrigger();

  if (!SYSTEM_USER.pseudo || !SYSTEM_USER.email || !SYSTEM_USER.password_hash) {
    throw new Error('SYSTEM_USER_* env values are required for prod seed.');
  }

  const upsertedSystemUser = await prismaClient.user.upsert({
    where: { email: SYSTEM_USER.email },
    create: {
      ...(env.SYSTEM_USER_ID ? { id: env.SYSTEM_USER_ID } : {}),
      firstname: SYSTEM_USER.firstname,
      lastname: SYSTEM_USER.lastname,
      pseudo: SYSTEM_USER.pseudo,
      email: SYSTEM_USER.email,
      password_hash: SYSTEM_USER.password_hash,
      role: SYSTEM_USER.role,
      date_created: SYSTEM_USER.date_created,
      date_updated: SYSTEM_USER.date_updated,
      is_active: SYSTEM_USER.is_active,
    },
    update: {
      firstname: SYSTEM_USER.firstname,
      lastname: SYSTEM_USER.lastname,
      pseudo: SYSTEM_USER.pseudo,
      email: SYSTEM_USER.email,
      password_hash: SYSTEM_USER.password_hash,
      role: SYSTEM_USER.role,
      date_created: SYSTEM_USER.date_created,
      date_updated: SYSTEM_USER.date_updated,
      is_active: SYSTEM_USER.is_active,
    },
  });
  const resolvedSystemUserId = upsertedSystemUser.id;

  const itemCategoriesCount = await prismaClient.category.count();
  const itemTypesCount = await prismaClient.type.count();
  const itemsCount = await prismaClient.item.count();

  if (!itemCategoriesCount) {
    for (const e of ITEM_CATEGORIES) {
      await prismaCategory.create({ data: { ...e, user_id: resolvedSystemUserId } });
    }
  }

  if (!itemTypesCount) {
    for (const e of ITEM_TYPES) {
      await prismaType.create(resolvedSystemUserId, e);
    }
  }

  if (!itemsCount) {
    for (const e of ITEMS) {
      await prismaItem.create({ ...e, userId: resolvedSystemUserId });
    }
  }

  await prismaClient.category.updateMany({
    where: {
      NOT: {
        user_id: resolvedSystemUserId,
      },
    },
    data: {
      user_id: resolvedSystemUserId,
    },
  });

  await prismaClient.type.updateMany({
    where: {
      NOT: {
        user_id: resolvedSystemUserId,
      },
    },
    data: {
      user_id: resolvedSystemUserId,
    },
  });

  await prismaClient.item.updateMany({
    where: {
      NOT: {
        user_id: resolvedSystemUserId,
      },
    },
    data: {
      user_id: resolvedSystemUserId,
    },
  });
};

export { seedSystemData };
