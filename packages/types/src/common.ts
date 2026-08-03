import type { dateSortSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type DateSort = z.infer<typeof dateSortSchema>;
