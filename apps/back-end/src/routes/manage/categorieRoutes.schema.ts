import z from 'zod';

const categoryCreateSchema = z.object({
  name: z.string().min(1),
  is_active: z.boolean().optional(),
});

const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

export { categoryCreateSchema, categoryUpdateSchema };
