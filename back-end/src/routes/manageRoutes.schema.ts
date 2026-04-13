import { z } from 'zod';

const categoryCreateSchema = z.object({
  name: z.string().min(1),
  is_active: z.boolean().optional(),
});

const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

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

const includeQuerySchema = z.object({
  include: z.string().optional(),
});

export {
  includeQuerySchema,
  itemUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  typeCreateSchema,
  typeUpdateSchema,
  itemCreateSchema,
};
