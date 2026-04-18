import type { TypeRepository } from '../../lib/repositories/index.js';

class TypesService {
  constructor(private readonly typesRepository: TypeRepository) {}

  async list(userId: string) {
    const rows = await this.typesRepository.findMany(undefined, userId);
    rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }

  getById(id: string, userId: string) {
    return this.typesRepository.findUnique({ where: { id } }, userId);
  }

  create(
    data: {
      name: string;
      category_id: string;
      is_active?: boolean;
      supports_limited?: boolean;
      is_stackable?: boolean;
    },
    userId: string
  ) {
    const now = new Date().toISOString();
    return this.typesRepository.create({
      data: {
        name: data.name,
        category_id: data.category_id,
        is_active: data.is_active ?? true,
        supports_limited: data.supports_limited ?? false,
        is_stackable: data.is_stackable ?? false,
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
      category_id?: string;
      is_active?: boolean;
      supports_limited?: boolean;
      is_stackable?: boolean;
    },
    userId: string
  ) {
    return this.typesRepository.update(
      {
        where: { id },
        data: { ...data, date_updated: new Date().toISOString() },
      },
      userId
    );
  }
}

export { TypesService };
