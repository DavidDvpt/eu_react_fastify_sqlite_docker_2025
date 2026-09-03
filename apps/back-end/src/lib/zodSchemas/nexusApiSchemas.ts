import { booleanSchema } from '@eu/zod-schemas';
import z from 'zod';

const itemPropertiesEconomySchema = z.object({
  MaxTT: z.coerce.number().default(0),
  MinTT: z.coerce.number().nullable().default(null),
  Decay: z.coerce.number().nullable().default(null),
});

const itemPropertiesSkill = z.object({
  LearningIntervalStart: z.coerce.number().nullable().default(null),
  LearningIntervalEnd: z.coerce.number().nullable().default(null),
  IsSiB: booleanSchema,
});

const itemPropertiesSchema = z.object({
  Description: z.string().nullable(),
  Type: z.string().nullable().default(null),
  Weight: z.coerce.number().nullable().default(null),
  UsesPerMinute: z.coerce.number().nullable().default(null),
  Efficiency: z.coerce.number().nullable().default(null),
  Depth: z.coerce.number().nullable().default(null),
  Economy: itemPropertiesEconomySchema,
  Skill: itemPropertiesSkill.optional(),
  IsUntradeable: z.boolean(),
  IsRare: z.boolean(),
});

const effectOnEquipSchema = z.object({});
const tierSchema = z.object({});
const itemLink = z.object({
  $Url: z.string(),
});

export const nexusApiItemSchema = z.object({
  Id: z.number(),
  ClassId: z.coerce.number().nullable(),
  ItemId: z.coerce.number(),
  Type: z.string().nullable().default(null),
  SubType: z.string().nullable().default(null),
  Score: z.coerce.number().nullable().default(null),
  Name: z.string(),
  Properties: itemPropertiesSchema.nullable().default(null),
  EffectsOnEquip: effectOnEquipSchema.array().nullable().default(null),
  Tiers: tierSchema.array().nullable().default(null),
  Links: itemLink.nullable().default(null),
});
