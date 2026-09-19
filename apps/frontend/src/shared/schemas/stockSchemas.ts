import { z } from "zod";

export const stockQuerySchema = z.object({ itemId: z.string() }).partial();

export type StockQuery = z.infer<typeof stockQuerySchema>;
