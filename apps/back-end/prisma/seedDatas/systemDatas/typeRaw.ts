// Auto-generated from datas.sql
import type { Prisma } from '../../generated/client.js';

export const TYPES_RAW_BASE: Omit<
  Prisma.TypeCreateManyInput,
  'user_id' | 'date_created' | 'date_updated' | 'is_active' | 'is_stackable'
>[] = [
  {
    id: '25F61687-F547-4712-8B91-786889BA6CF1',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Ores',
  },
  {
    id: '2E4D69AA-BBEC-44E7-B4A3-4F3EC17B6C78',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Enmatters',
  },
  {
    id: '2FE7B2D0-73CB-4E53-96A6-3BC32C5E7188',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Animal Oils',
  },
  {
    id: '3D9AE042-489C-4996-88D3-0EACABFABE92',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Natural Materials',
  },
  {
    id: '5DFA9973-5F3F-4FF5-A98B-BB585E1E39D5',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Refined Enmatters',
  },
  {
    id: 'B274D976-0D05-4415-98C6-08798B14A6A2',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Refined Ores',
  },
  {
    id: 'F39D2654-E076-4971-902F-B28511E12E48',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    name: 'Consumables',
  },
] as const;
