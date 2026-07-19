import { z } from "zod";

export const itemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  imageUrlId: z.string(),
  value: z.number().nonnegative(),
  isLimited: z.boolean().optional(),
  isStackable: z.boolean().optional(),
  typeId: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  userId: z.string(),
});
