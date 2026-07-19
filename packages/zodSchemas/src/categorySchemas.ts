import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  is_active: z.boolean().optional(),
});
