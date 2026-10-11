import { z } from "zod";
import { REFINING_PROVENANCES } from "@/shared/helpers/refining";

/**
 * Valeurs du formulaire de raffinage. `clickCount` (nombre de résultats) doit
 * être un multiple du PPCM de la recette sélectionnée : cette contrainte
 * dépend de la recette choisie et est donc validée dans la modale après la
 * sélection.
 */
export const refiningFormSchema = z.object({
  result: z.string().min(1, "Sélectionnez une recette"),
  clickCount: z
    .number()
    .int("Quantité invalide")
    .positive("Quantité invalide"),
  provenance: z
    .array(z.enum([...REFINING_PROVENANCES]))
    .min(1, "Sélectionnez au moins une provenance"),
});

export type RefiningFormValues = z.infer<typeof refiningFormSchema>;