import { z } from "zod";

export const typeFormSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string(),
  isActive: z.boolean().optional(),
  isStackable: z.boolean().optional(),
});
