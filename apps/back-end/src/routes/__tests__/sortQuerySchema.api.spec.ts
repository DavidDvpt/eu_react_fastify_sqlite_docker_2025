import { itemQuerySchema, typeQuerySchema } from '@eu/zod-schemas';
import { describe, expect, it } from 'vitest';

describe('sort query schemas', () => {
  it('normalizes empty sortOrder for items', () => {
    const result = itemQuerySchema.parse({ sortOrder: '' });

    expect(result.sortOrder).toBeUndefined();
  });

  it('normalizes empty sortOrder for types', () => {
    const result = typeQuerySchema.parse({ sortOrder: '' });

    expect(result.sortOrder).toBeUndefined();
  });
});
