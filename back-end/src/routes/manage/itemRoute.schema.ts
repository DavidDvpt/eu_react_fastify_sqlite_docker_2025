import z from 'zod';

const itemCreateSchema = z.object({
  name: z.string().min(1),
  image_url_id: z.string(),
  value: z.coerce.number(),
  is_limited: z.boolean(),
  is_stackable: z.boolean().optional(),
  item_type_id: z.string().min(1),
  is_active: z.boolean().optional(),
});

const itemUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image_url_id: z.string().optional(),
  value: z.coerce.number().optional(),
  is_limited: z.boolean().optional(),
  is_stackable: z.boolean().optional(),
  item_type_id: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

export { itemUpdateSchema, itemCreateSchema };
