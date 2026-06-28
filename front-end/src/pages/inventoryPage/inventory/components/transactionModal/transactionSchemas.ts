import type { TransactionAction } from "@/shared/types/transactions";
import z from "zod";

export function transactionFormSchema(
  maxQuantity: number,
  action: TransactionAction,
) {
  return z.object({
    action: z.literal(action),
    autoCalculation: z.boolean(),
    quantity: z.coerce
      .number()
      .int()
      .positive("La quantite doit etre superieure a 0.")
      .refine(
        (value) => action === "buy" || value <= maxQuantity,
        {
          message: `La quantite doit etre inferieure ou egale a ${maxQuantity}.`,
        },
      ),
    fee: z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return 0;
        }
        return value;
      },
      z.coerce
        .number()
        .nonnegative("Le fee doit etre positif ou nul.")
        .max(100, "Le fee doit etre inferieur ou egal a 100."),
    ),
    ttc: z.coerce
      .number()
      .positive(
        action === "buy"
          ? "Le prix d'achat doit etre superieur a 0."
          : "Le TTC doit etre superieur a 0.",
      ),
  });
}

// export const sellFormSchema = (maxQuantity: number) =>
//   z.object({
//     autoCalculation: z.boolean(),
//     quantity: z.coerce
//       .number()
//       .int()
//       .positive("La quantite doit etre superieure a 0.")
//       .max(
//         maxQuantity,
//         `La quantite doit etre inferieure ou egale a ${maxQuantity}.`,
//       ),
//     fee: z.coerce
//       .number()
//       .nonnegative("Le fee doit etre positif ou nul.")
//       .max(100, "Le fee doit etre inferieur ou egal a 100."),
//     ttc: z.coerce.number().positive("Le TTC doit etre superieur a 0."),
//   });
