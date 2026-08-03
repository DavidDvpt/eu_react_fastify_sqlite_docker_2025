import type {
  itemDtoSchema,
  itemFormSchema,
  itemSortSchema,
} from "@eu/zod-schemas";
import { z } from "zod";

export type ItemSortKey = z.infer<typeof itemSortSchema>;

export type ItemDto = z.infer<typeof itemDtoSchema>;

export type ItemFormBody = z.output<typeof itemFormSchema>;
