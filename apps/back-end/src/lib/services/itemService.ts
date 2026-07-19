import prismaClient from '../../../prisma/prismaClient.js';

import type { Item } from '../../../prisma/generated/client.js';
import type { ItemRepository } from '../repositories/itemRepository.js';

export class ItemService {
  constructor() {}
}
export const loadItemId = async (
  itemRepo: ItemRepository,
  itemId: string
): Promise<Item | null> => {
  const item = await prismaClient.item.findUnique({
    where: { id: itemId },
  });

  return item;
};
