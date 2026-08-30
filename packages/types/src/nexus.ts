import type { nexusDotSchema } from "@eu/zod-schemas";
import type z from "zod";

export type NexusUpdateDto = z.infer<typeof nexusDotSchema>;
