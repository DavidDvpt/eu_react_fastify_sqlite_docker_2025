import { ItemCategoryRepository } from '../src/lib/repositories/itemCategoryRepository.js';
import { ItemRepository } from '../src/lib/repositories/itemRepository.js';
import { ItemTypeRepository } from '../src/lib/repositories/itemTypeRepository.js';
import prismaClient from './prismaClient.js';
import { ITEM_CATEGORIES } from './seedDatas/item_categories.js';
import { ITEM_TYPES } from './seedDatas/item_types.js';
import { ITEMS } from './seedDatas/items.js';

const itemCategoryRepository = new ItemCategoryRepository(prismaClient);
const itemTypesRepository = new ItemTypeRepository(prismaClient);
const itemRepository = new ItemRepository(prismaClient);

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
