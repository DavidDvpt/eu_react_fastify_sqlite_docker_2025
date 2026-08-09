import { z } from "zod";

export const stockSchema = z.record(z.string(), z.number());
export const stockQuerySchema = z.object({ itemId: z.string() }).partial();
