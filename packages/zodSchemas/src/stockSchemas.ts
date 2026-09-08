import { z } from "zod";

export const stockSchema = z.record(z.string(), z.number());
export const stockQuerySchema = z.object({ itemId: z.string() }).partial();

export type StockQuery = z.infer<typeof stockQuerySchema>;
export type Stock = z.infer<typeof stockSchema>;
