import { CategoryRepository } from '../src/lib/repositories/categoryRepository.js';
import { ItemRepository } from '../src/lib/repositories/itemRepository.js';
import { TypeRepository } from '../src/lib/repositories/typeRepository.js';
import { UserRepository } from '../src/lib/repositories/userRepository.js';
import prismaClient from './prismaClient.js';
import { ITEM_CATEGORIES } from './seedDatas/item_categories.js';
import { ITEM_TYPES } from './seedDatas/item_types.js';
import { ITEMS } from './seedDatas/items.js';
import { LOTS } from './seedDatas/lots.js';
import { SESSIONS_BUY, SESSION_BUY_LINES } from './seedDatas/session_buy.js';
import { SESSIONS_SELL, SESSION_SELL_LINES } from './seedDatas/session_sell.js';
import { SYSTEM_USER_ID } from './seedDatas/systemUser.js';
import { USERS } from './seedDatas/user.js';

const userRepository = new UserRepository(prismaClient);
const itemCategoryRepository = new CategoryRepository(prismaClient);
const itemTypesRepository = new TypeRepository(prismaClient);
const itemRepository = new ItemRepository(prismaClient);
const DEFAULT_DATA_USER_ID = '0FB0E33F-424C-4A2A-A135-FFF8A2D81E5E';

const systemUser = SYSTEM_USER_ID ? USERS.find((user) => user.id === SYSTEM_USER_ID) : undefined;
const defaultDataUser = USERS.find((user) => user.id === DEFAULT_DATA_USER_ID);

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

if (defaultDataUser) {
  await prismaClient.user.upsert({
    where: { id: defaultDataUser.id },
    create: defaultDataUser,
    update: {
      firstname: defaultDataUser.firstname,
      lastname: defaultDataUser.lastname,
      pseudo: defaultDataUser.pseudo,
      email: defaultDataUser.email,
      password_hash: defaultDataUser.password_hash,
      role: defaultDataUser.role,
      date_created: defaultDataUser.date_created,
      date_updated: defaultDataUser.date_updated,
      is_active: defaultDataUser.is_active,
    },
  });
}

const users = await userRepository.findMany();
if (!users.length) {
  for (const user of USERS) {
    await userRepository.create({ data: user });
  }
}
const itemCategories = await itemCategoryRepository.findMany();

if (!itemCategories.length) {
  for (const e of ITEM_CATEGORIES) {
    await itemCategoryRepository.create({ data: e });
  }
}

const itemTypes = await itemTypesRepository.findMany();

if (!itemTypes.length) {
  for (const e of ITEM_TYPES) {
    await itemTypesRepository.create({ data: e });
  }
}

const items = await itemRepository.findMany();

if (!items.length) {
  for (const e of ITEMS) {
    await itemRepository.create({ data: e });
  }
}

const sessionsCount = await prismaClient.session.count();
if (!sessionsCount) {
  const sessionsData = [...SESSIONS_BUY, ...SESSIONS_SELL].map((session) => ({
    ...session,
    user_id: DEFAULT_DATA_USER_ID,
  }));
  await prismaClient.session.createMany({
    data: sessionsData,
    skipDuplicates: true,
  });
}

const lotsCount = await prismaClient.lot.count();
if (!lotsCount) {
  await prismaClient.lot.createMany({
    data: LOTS.map((lot) => ({ ...lot, user_id: DEFAULT_DATA_USER_ID })),
    skipDuplicates: true,
  });
}

const sessionLinesCount = await prismaClient.sessionLine.count();
if (!sessionLinesCount) {
  const sessionLinesData = [...SESSION_BUY_LINES, ...SESSION_SELL_LINES].map((line) => ({
    ...line,
    user_id: DEFAULT_DATA_USER_ID,
  }));
  await prismaClient.sessionLine.createMany({
    data: sessionLinesData,
    skipDuplicates: true,
  });
}

await prismaClient.session.updateMany({
  where: {},
  data: { user_id: DEFAULT_DATA_USER_ID },
});

await prismaClient.lot.updateMany({
  where: { user_id: null },
  data: { user_id: DEFAULT_DATA_USER_ID },
});
