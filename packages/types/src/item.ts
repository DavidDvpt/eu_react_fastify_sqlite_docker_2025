import type { itemFormSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type ItemDto = {
  id: string;
  name: string;
  imageUrlId: string;
  value: number;
  isLimited: boolean;
  supportsLimited?: boolean;
  isStackable: boolean;
  typeId: string;
  categoryId?: string;
  isActive: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string | null;
  type?: any;
  category?: any;
};

export type ItemFormBody = z.infer<typeof itemFormSchema>;
