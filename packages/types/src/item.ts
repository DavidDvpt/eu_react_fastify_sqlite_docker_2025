import {
  itemDetailsEnum,
  itemFormWithIdSchema,
  type itemDtoSchema,
  type itemFormSchema,
  type itemQuerySchema,
  type itemSortKeysSchema,
} from "@eu/zod-schemas";
import { z } from "zod";

export type ItemSortKeys = z.infer<typeof itemSortKeysSchema>;
export type ItemDetailEnum = z.infer<typeof itemDetailsEnum>;
export type ItemDto = z.infer<typeof itemDtoSchema>;
export type ItemDtos = ItemDto[];

export type ItemQuerySchema = z.infer<typeof itemQuerySchema>;

export type ItemFormBody = z.output<typeof itemFormSchema>;
export type ItemFormBodyWithId = z.output<typeof itemFormWithIdSchema>;
