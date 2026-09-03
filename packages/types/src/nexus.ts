import type {
  nexusDtoSchema,
  nexusFormSchema,
  nexusRequestTypeSchema,
} from "@eu/zod-schemas";
import type z from "zod";

export type NexusRequestTypeEnum = z.infer<typeof nexusRequestTypeSchema>;
export type NexusUpdateDto = z.infer<typeof nexusDtoSchema>;
export type NexusFormBody = z.output<typeof nexusFormSchema>;
