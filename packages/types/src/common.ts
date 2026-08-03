import type { dateSortKeySchema } from "@eu/zod-schemas";
import { z } from "zod";

export type DateSort = z.infer<typeof dateSortKeySchema>;
