import type { ItemRepository } from '../../lib/repositories/index.js';

class ItemsService {
  constructor(private readonly itemsRepository: ItemRepository) {}

  async list(userId: string) {
    const rows = await this.itemsRepository.findMany(undefined, userId);
    rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }

  getById(id: string, userId: string) {
    return this.itemsRepository.findUnique({ where: { id } }, userId);
  }

  create(
    data: {
      name: string;
      image_url_id: string;
      value: number;
      is_limited: boolean;
      item_type_id: string;
      is_stackable?: boolean;
      is_active?: boolean;
    },
    userId: string
  ) {
    const now = new Date().toISOString();
    return this.itemsRepository.create({
      data: {
        name: data.name,
        image_url_id: data.image_url_id,
        value: data.value,
        is_limited: data.is_limited,
        is_stackable: data.is_stackable ?? true,
        item_type_id: data.item_type_id,
        is_active: data.is_active ?? true,
        date_created: now,
        date_updated: null,
        user_id: userId,
      },
    });
  }

  update(
    id: string,
    data: {
      name?: string;
      image_url_id?: string;
      value?: number;
      is_limited?: boolean;
      is_stackable?: boolean;
      item_type_id?: string;
      is_active?: boolean;
    },
    userId: string
  ) {
    return this.itemsRepository.update(
      {
        where: { id },
        data: { ...data, date_updated: new Date().toISOString() },
      },
      userId
    );
  }
}

export { ItemsService };
