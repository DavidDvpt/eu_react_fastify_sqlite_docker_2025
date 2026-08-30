import type { nexusDtoSchema, nexusFormSchema } from "@eu/zod-schemas";
import type z from "zod";

export type NexusUpdateDto = z.infer<typeof nexusDtoSchema>;
export type NexusFormBody = z.output<typeof nexusFormSchema>;
