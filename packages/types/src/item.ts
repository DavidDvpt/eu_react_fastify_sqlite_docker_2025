import type { itemFormSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type ItemDto = {
  id: string;
  name: string;
  imageUrlId: string;
  value: number;
  isLimited: boolean;
  supportsLimited?: boolean;
  typeId: string;
  categoryId?: string;
  isActive: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string | null;
  type?: any;
  category?: any;
};

export type ItemFormIntputBody = z.input<typeof itemFormSchema>;
export type ItemFormOutputBody = z.output<typeof itemFormSchema>;
