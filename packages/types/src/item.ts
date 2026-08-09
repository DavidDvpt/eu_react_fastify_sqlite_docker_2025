import type {
  itemDtoSchema,
  itemFormSchema,
  itemQuerySchema,
  itemSortSchema,
} from "@eu/zod-schemas";
import { z } from "zod";

export type ItemSortKey = z.infer<typeof itemSortSchema>;

export type ItemDto = z.infer<typeof itemDtoSchema>;
export type ItemDtos = ItemDto[];

export type ItemQuerySchema = z.infer<typeof itemQuerySchema>;

export type ItemFormBody = z.output<typeof itemFormSchema>;
