import { itemQuerySchema, typeQuerySchema } from '@eu/zod-schemas';
import { describe, expect, it } from 'vitest';

describe('sort query schemas', () => {
  it('accepts omitted sortOrder for items', () => {
    const result = itemQuerySchema.parse({});

    expect(result.sortOrder).toBeUndefined();
  });

  it('accepts omitted sortOrder for types', () => {
    const result = typeQuerySchema.parse({});

    expect(result.sortOrder).toBeUndefined();
  });
});
