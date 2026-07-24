import { z } from "zod";

export const itemFormSchema = z.object({
  name: z.string().min(1),
  imageUrlId: z.string(),
  value: z.number().nonnegative(),
  isLimited: z.boolean().optional(),
  isStackable: z.boolean().optional(),
  typeId: z.string(),
  isActive: z.boolean().optional(),
});
