import z from "zod";

export const nexusParamsSchema = z.object({
  type: z.string().optional(),
});
export const nexusQuerySchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
});
