// Auto-generated from datas.sql
import type { Prisma } from '../generated/client.js';
import { SYSTEM_USER_ID } from './systemUser.js';

const RAW_ITEM_TYPES: Omit<Prisma.TypeCreateManyInput, 'user_id'>[] = [
  {
    id: '25F61687-F547-4712-8B91-786889BA6CF1',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    date_created: '2025-11-23 11:59:01.5957176',
    date_updated: null,
    is_active: true,
    is_stackable: true,
    supports_limited: false,
    name: 'Ores',
  },
  {
    id: '2E4D69AA-BBEC-44E7-B4A3-4F3EC17B6C78',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    date_created: '2025-11-23 11:59:01.6147729',
    date_updated: null,
    is_active: true,
    is_stackable: true,
    supports_limited: false,
    name: 'Enmatters',
  },
  {
    id: '2FE7B2D0-73CB-4E53-96A6-3BC32C5E7188',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    date_created: '2025-11-23 11:59:01.6159859',
    date_updated: null,
    is_active: true,
    is_stackable: true,
    supports_limited: false,
    name: 'Animal Oils',
  },
  {
    id: '3D9AE042-489C-4996-88D3-0EACABFABE92',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    date_created: '2025-11-23 11:59:01.6162222',
    date_updated: null,
    is_active: true,
    is_stackable: true,
    supports_limited: false,
    name: 'Natural Materials',
  },
  {
    id: '5DFA9973-5F3F-4FF5-A98B-BB585E1E39D5',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    date_created: '2025-11-23 11:59:01.6151835',
    date_updated: null,
    is_active: true,
    is_stackable: true,
    supports_limited: false,
    name: 'Refined Enmatters',
  },
  {
    id: 'B274D976-0D05-4415-98C6-08798B14A6A2',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    date_created: '2025-11-23 11:59:01.6154621',
    date_updated: null,
    is_active: true,
    is_stackable: true,
    supports_limited: false,
    name: 'Refined Ores',
  },
  {
    id: 'F39D2654-E076-4971-902F-B28511E12E48',
    category_id: '88B86318-0F7B-4D68-B095-D0DC313324A5',
    date_created: '2025-11-23 11:59:01.6157406',
    date_updated: null,
    is_active: true,
    is_stackable: true,
    supports_limited: false,
    name: 'Consumables',
  },
] as const;

export const ITEM_TYPES: Prisma.TypeCreateManyInput[] = RAW_ITEM_TYPES.map((itemType) => ({
  ...itemType,
  user_id: SYSTEM_USER_ID,
}));
