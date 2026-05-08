import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CategoryRepository,
  ItemRepository,
  TypeRepository,
} from '../src/lib/repositories/index.js';
import prismaClient from './prismaClient.js';
import { ITEM_CATEGORIES } from './seedDatas/item_categories.js';
import { ITEM_TYPES } from './seedDatas/item_types.js';
import { ITEMS } from './seedDatas/items.js';
import { SYSTEM_USER_ID } from './seedDatas/systemUser.js';
import { USERS } from './seedDatas/user.js';

const itemCategoryRepository = new CategoryRepository(prismaClient);
const itemTypesRepository = new TypeRepository(prismaClient);
const itemRepository = new ItemRepository(prismaClient);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const installSessionLineSoldedArchiveTrigger = async () => {
  const triggerSqlFilePath = join(__dirname, 'sqlFiles', 'sessionLineSoldedArchiveTrigger.sql');
  const triggerSql = await readFile(triggerSqlFilePath, 'utf-8');
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

  const systemUser = SYSTEM_USER_ID ? USERS.find((user) => user.id === SYSTEM_USER_ID) : undefined;

  if (systemUser) {
    await prismaClient.user.upsert({
      where: { id: systemUser.id },
      create: systemUser,
      update: {
        firstname: systemUser.firstname,
        lastname: systemUser.lastname,
        pseudo: systemUser.pseudo,
        email: systemUser.email,
        password_hash: systemUser.password_hash,
        role: systemUser.role,
        date_created: systemUser.date_created,
        date_updated: systemUser.date_updated,
        is_active: systemUser.is_active,
      },
    });
  }

  const itemCategoriesCount = await prismaClient.category.count();
  const itemTypesCount = await prismaClient.type.count();
  const itemsCount = await prismaClient.item.count();

  if (!itemCategoriesCount) {
    for (const e of ITEM_CATEGORIES) {
      await itemCategoryRepository.create({ data: e });
    }
  }

  if (!itemTypesCount) {
    for (const e of ITEM_TYPES) {
      await itemTypesRepository.create({ data: e });
    }
  }

  if (!itemsCount) {
    for (const e of ITEMS) {
      await itemRepository.create({ data: e });
    }
  }

  if (SYSTEM_USER_ID) {
    await prismaClient.category.updateMany({
      where: {
        NOT: {
          user_id: SYSTEM_USER_ID,
        },
      },
      data: {
        user_id: SYSTEM_USER_ID,
      },
    });

    await prismaClient.type.updateMany({
      where: {
        NOT: {
          user_id: SYSTEM_USER_ID,
        },
      },
      data: {
        user_id: SYSTEM_USER_ID,
      },
    });

    await prismaClient.item.updateMany({
      where: {
        NOT: {
          user_id: SYSTEM_USER_ID,
        },
      },
      data: {
        user_id: SYSTEM_USER_ID,
      },
    });
  }
};

export { seedSystemData };
