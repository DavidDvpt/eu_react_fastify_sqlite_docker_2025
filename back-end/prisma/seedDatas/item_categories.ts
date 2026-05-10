// Auto-generated from datas.sql
import type { Prisma } from "../generated/client.js";
import { SYSTEM_USER_ID } from "./systemUser.js";

export const ITEM_CATEGORIES: Prisma.CategoryCreateManyInput[] = [
  {
    id: "88B86318-0F7B-4D68-B095-D0DC313324A5",
    date_created: "2025-11-23 11:59:01.4929515",
    date_updated: null,
    is_active: true,
    name: "Material",
    user_id: SYSTEM_USER_ID,
  },
] as const;
