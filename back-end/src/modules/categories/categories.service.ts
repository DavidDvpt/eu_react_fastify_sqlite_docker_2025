import type { CategoryRepository } from '../../lib/repositories/index.js';

class CategoriesService {
  constructor(private readonly categoriesRepository: CategoryRepository) {}

  async list(userId: string) {
    const rows = await this.categoriesRepository.findMany(undefined, userId);
    rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }

  getById(id: string, userId: string) {
    return this.categoriesRepository.findUnique({ where: { id } }, userId);
  }

  create(
    data: {
      name: string;
      is_active?: boolean;
    },
    userId: string
  ) {
    const now = new Date().toISOString();
    return this.categoriesRepository.create({
      data: {
        name: data.name,
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
      is_active?: boolean;
    },
    userId: string
  ) {
    return this.categoriesRepository.update(
      {
        where: { id },
        data: { ...data, date_updated: new Date().toISOString() },
      },
      userId
    );
  }
}

export { CategoriesService };

