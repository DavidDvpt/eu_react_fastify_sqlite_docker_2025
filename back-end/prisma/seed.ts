import { ItemCategoryRepository } from '../src/lib/repositories/itemCategoryRepository.js';
import { ItemRepository } from '../src/lib/repositories/itemRepository.js';
import { ItemTypeRepository } from '../src/lib/repositories/itemTypeRepository.js';
import { UserRepository } from '../src/lib/repositories/userRepository.js';
import prismaClient from './prismaClient.js';
import { ITEM_CATEGORIES } from './seedDatas/item_categories.js';
import { ITEM_TYPES } from './seedDatas/item_types.js';
import { ITEMS } from './seedDatas/items.js';
import { INVENTORY_LOTS_SESSION } from './seedDatas/inventory_lots_session.js';
import { SESSIONS_TRADE, SESSION_TRADE_LINES } from './seedDatas/session_trade.js';
import { USERS } from './seedDatas/user.js';

const userRepository = new UserRepository(prismaClient);
const itemCategoryRepository = new ItemCategoryRepository(prismaClient);
const itemTypesRepository = new ItemTypeRepository(prismaClient);
const itemRepository = new ItemRepository(prismaClient);

const users = await userRepository.findMany();

if (!users.length) {
  for (const e of USERS) {
    await userRepository.create({ data: e });
  }
}
const itemCategories = await itemCategoryRepository.findMany();

if (!itemCategories.length) {
  ITEM_CATEGORIES.forEach(async (e) => {
    await itemCategoryRepository.create({ data: e });
  });
}

const itemTypes = await itemTypesRepository.findMany();

if (!itemTypes.length) {
  ITEM_TYPES.forEach(async (e) => {
    await itemTypesRepository.create({ data: e });
  });
}

const items = await itemRepository.findMany();

if (!items.length) {
  ITEMS.forEach(async (e) => {
    await itemRepository.create({ data: e });
  });
}

const sessionsCount = await prismaClient.session.count();
if (!sessionsCount) {
  await prismaClient.session.createMany({
    data: SESSIONS_TRADE,
    skipDuplicates: true,
  });
}

const sessionLinesCount = await prismaClient.sessionLine.count();
if (!sessionLinesCount) {
  await prismaClient.sessionLine.createMany({
    data: SESSION_TRADE_LINES,
    skipDuplicates: true,
  });
}

const inventoryLotsCount = await prismaClient.inventoryLot.count();
if (!inventoryLotsCount) {
  await prismaClient.inventoryLot.createMany({
    data: INVENTORY_LOTS_SESSION,
    skipDuplicates: true,
  });
}
