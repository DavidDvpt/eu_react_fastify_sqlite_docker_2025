import type { PedCardFormValues } from "@/shared/types/pedcard";
import z from "zod";

export const pedCardFormDefaultValues: PedCardFormValues = {
  updatedValue: 0,
};

export const pedCardFormSchema = z.object({
  updatedValue: z.coerce
    .number("La valeur doit etre un nombre")
    .nonnegative("La valeur ne peut pas etre négative."),
});
