import z from 'zod';

const typeCreateSchema = z.object({
  name: z.string().min(1),
  category_id: z.string().min(1),
  is_active: z.boolean().optional(),
  supports_limited: z.boolean().optional(),
  is_stackable: z.boolean().optional(),
});

const typeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category_id: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
  supports_limited: z.boolean().optional(),
  is_stackable: z.boolean().optional(),
});

export { typeUpdateSchema, typeCreateSchema };
