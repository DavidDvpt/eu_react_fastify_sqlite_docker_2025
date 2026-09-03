import type { importResultSchema, itemFormWithIdSchema } from "@eu/zod-schemas";
import type z from "zod";

export type NexusImportResult = z.infer<typeof importResultSchema>;
