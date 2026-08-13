import { z } from "zod";

export const transactionTypeSchema = z.enum([
  "BUY",
  "SELL",
  "FOUND",
  "GIFT",
  "EXISTING_STOCK",
  "SELL",
  "GIVEN",
]);
