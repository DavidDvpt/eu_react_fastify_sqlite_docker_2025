import z from 'zod';

export const nexusCountsSchema = z.record(
  z.string(),
  z.object({
    itemCount: z.number().int().nonnegative(),
    itemCountWithoutImage: z.number().int().nonnegative(),
  })
);

export type NexusCounts = z.infer<typeof nexusCountsSchema>;
