import { z } from "zod";
import {
  categoryDtoSchema,
  categoryFormSchema,
  categorySortKey,
} from "@eu/zod-schemas";

export type CategoryDto = z.infer<typeof categoryDtoSchema>;

export type CategoryFormBody = z.output<typeof categoryFormSchema>;

export type CategorySortKey = z.infer<typeof categorySortKey>;
