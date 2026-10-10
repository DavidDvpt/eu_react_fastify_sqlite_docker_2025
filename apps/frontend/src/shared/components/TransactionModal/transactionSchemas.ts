import type { TransactionAction } from "@/shared/types/transactions";
import {
  FREE_TTC_MAX_DECIMALS,
  hasMaxFreeDecimals,
  normalizeDecimalInput,
} from "@/shared/helpers/transactionHelpers";
import z from "zod";

export type TransactionFormSchemaOptions = {
  /** Item stackability. Unknown => bulk rule skipped. */
  isStackable?: boolean;
  itemValue?: number;
  /** Bulk-purchase eligibility. Defaults to true. */
  allowBulk?: boolean;
};

export function transactionFormSchema(
  maxQuantity: number,
  action: TransactionAction,
  options?: TransactionFormSchemaOptions,
) {
  const isStackable = options?.isStackable;
  const isNonStackableBuy = action === "buy" && isStackable === false;
  const allowBulk = options?.allowBulk ?? true;
  return z
    .object({
      action: z.literal(action),
      isAuction: z.boolean(),
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
      tt: z.preprocess(
        normalizeDecimalInput,
        z.coerce.number().positive("Le TT doit etre superieur a 0.").optional(),
      ),
      fee: z.preprocess(
        (value) => {
          if (value === "" || value === undefined || value === null) {
            return 0;
          }
          return normalizeDecimalInput(value);
        },
        z.coerce
          .number()
          .nonnegative("Le fee doit etre positif ou nul.")
          .max(100, "Le fee doit etre inferieur ou egal a 100."),
      ),
      lotCount: z.coerce.number().int().min(1, "Le nombre de lots doit etre au moins 1.").default(1),
      ttc: z.preprocess(
        normalizeDecimalInput,
        z.coerce.number().positive(
          action === "buy"
            ? "Le prix d'achat doit etre superieur a 0."
            : "Le TTC doit etre superieur a 0.",
        ),
      ),
      tierLevel: z.coerce
        .number()
        .int("Le tier doit etre un entier.")
        .min(0, "Le tier doit etre superieur ou egal a 0.")
        .max(10, "Le tier doit etre inferieur ou egal a 10.")
        .optional(),
    })
    .superRefine((values, ctx) => {
      if (values.isAuction) {
        if (!Number.isInteger(values.ttc)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ttc"],
            message: "En mode auction, le TTC doit etre un entier.",
          });
        }
        return;
      }
      if (!hasMaxFreeDecimals(values.ttc)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ttc"],
          message: `En mode libre, le TTC accepte au plus ${FREE_TTC_MAX_DECIMALS} decimales.`,
        });
        return;
      }
      if (isNonStackableBuy) {
        if (!allowBulk) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["lotCount"],
            message:
              "Cet item ne peut pas etre achete en plusieurs exemplaires.",
          });
          return;
        }
        if (values.lotCount < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["lotCount"],
            message: "Le nombre de lots doit etre au moins 1.",
          });
        }
      }
      if (isNonStackableBuy && options?.itemValue !== undefined && values.tt !== undefined && values.tt > options.itemValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tt"],
          message: "Le TT doit etre inferieur ou egal a la valeur de l'item.",
        });
      }
    })
    .superRefine((values, ctx) => {
      if (isNonStackableBuy && values.tt === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tt"],
          message: "Le TT est obligatoire pour un achat non-stackable.",
        });
      }
      if (
        isNonStackableBuy &&
        options?.itemValue !== undefined &&
        values.tt !== undefined &&
        values.tt > options.itemValue
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tt"],
          message: "Le TT doit etre inferieur ou egal a la valeur de l'item.",
        });
      }
      if (isNonStackableBuy && values.isAuction && values.lotCount > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lotCount"],
          message: "En mode auction, un seul lot est autorise.",
        });
      }
    });
}
