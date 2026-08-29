import type z from "zod";
import type { finderDtoSchema } from "../../zodSchemas/src/itemFinderSchemas.js";

export type Finder = z.infer<typeof finderDtoSchema>;
