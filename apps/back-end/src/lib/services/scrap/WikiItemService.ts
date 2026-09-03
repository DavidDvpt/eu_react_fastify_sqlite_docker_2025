import type { ImageListItem, WikiItemRow } from '#src/types/scraps/wikiItem.js';

import { PostgreService } from '#src/lib/services/scrap/PostgreService.js';

export class WikiItemService extends PostgreService {
  constructor() {
    super();
  }

  parseprismaToDto(row: WikiItemRow): Promise<ImageListItem> {
    try {
      return Promise.resolve({
        id: row.id,
        itemId: row.item_id,
        itemName: row.item_name,
        imageId: row.image_id,
        itemType: row.item_type,
        itemClass: row.item_class,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      throw new Error(`Error parsing WikiItemRow: ${message}`);
    }
  }

  async getAll({ limit = 100, offset = 0 }: { limit?: number; offset?: number } = {}): Promise<
    ImageListItem[]
  > {
    if (!this._pool) throw new Error('Db not configured');
    const result = await this._pool.query<WikiItemRow>(
      `
        SELECT
          id,
          item_id,
          item_name,
          image_id,
          item_type,
          item_class,
          created_at,
          updated_at
        FROM wiki_items
        ORDER BY item_id
        LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return Promise.all(result.rows.map((row) => this.parseprismaToDto(row)));
  }

  async getByName(itemName: string): Promise<ImageListItem | null> {
    if (!itemName) throw new Error('Item name is required');
    if (!this._pool) throw new Error('Db not configured');
    const result = await this._pool.query<WikiItemRow>(
      `
        SELECT
          id,
          item_id,
          item_name,
          image_id,
          item_type,
          item_class,
          created_at,
          updated_at
        FROM wiki_items
        WHERE item_name = $1
      `,
      [itemName]
    );

    const row = result.rows[0];

    if (!row) return null;

    return this.parseprismaToDto(row);
  }
}
