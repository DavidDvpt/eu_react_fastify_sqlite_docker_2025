import type { stockQuerySchema, stockSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type StockQuery = z.infer<typeof stockQuerySchema>;
export type Stock = z.infer<typeof stockSchema>;
