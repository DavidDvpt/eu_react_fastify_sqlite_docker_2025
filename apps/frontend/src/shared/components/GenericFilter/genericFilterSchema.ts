import z from "zod";

export const genericFilterSchema = z.object({
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  itemId: z.string().optional(),
});
