import prismaClient from 'prisma/prismaClient.js';

export class TypesService {
  private _client: typeof prismaClient.type;
  constructor() {
    this._client = prismaClient.type;
  }

  async getAll(userId: string) {
    const rows = await this._client.findMany({ where: { user_id: userId } });
    rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }

  async getById(id: string, userId: string) {
    return this._client.findUnique({ where: { id, user_id: userId } });
  }

  async create(
    userId: string,
    data: {
      name: string;
      category_id: string;
      is_active?: boolean;
      supports_limited?: boolean;
      is_stackable?: boolean;
    }
  ) {
    const now = new Date().toISOString();
    return this._client.create({
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

  async update(
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
    return this._client.update({
      where: { id, user_id: userId },
      data: { ...data, date_updated: new Date().toISOString() },
    });
  }
}
