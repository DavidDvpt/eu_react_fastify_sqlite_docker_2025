import z from "zod";

export const typeFormSchema = z.object({
  name: z.string().min(1),
  category_id: z.string().min(1),
  is_active: z.boolean().optional(),
  supports_limited: z.boolean().optional(),
  is_stackable: z.boolean().optional(),
});
