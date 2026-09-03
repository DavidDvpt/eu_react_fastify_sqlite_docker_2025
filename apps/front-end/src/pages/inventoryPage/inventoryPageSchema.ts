import z from "zod";
import { booleanSchema } from "@eu/zod-schemas";
import { genericListViewModeSchema } from "@/shared/components/GenericList";
import { genericFilterSchema } from "@/shared/components/GenericFilter/genericFilterSchema";

export const inventoryPageQuerySchema = genericFilterSchema
  .omit({ itemId: true })
  .extend({
    showAllItems: booleanSchema.optional(),
    urlViewMode: genericListViewModeSchema.default("list"),
  });

export type InventoryPageQuery = z.infer<typeof inventoryPageQuerySchema>;
