// Auto-generated from datas.sql
import type { Prisma } from '#prisma/generated/client.js';

export const CATEGORIES_RAW_BASE: Omit<
  Prisma.CategoryCreateManyInput,
  'user_id' | 'date_created' | 'date_updated' | 'is_active'
>[] = [
  {
    id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Material',
  },
] as const;
