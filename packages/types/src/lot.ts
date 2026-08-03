import type {
  lotBodySchema,
  lotDtoSchema,
  lotSortSchema,
  lotTypeSchema,
} from "@eu/zod-schemas";
import { z } from "zod";

export type LotTypeDto = z.output<typeof lotTypeSchema>;

export type LotFormBody = z.output<typeof lotBodySchema>;

export type LotSortKey = z.infer<typeof lotSortSchema>;

export type LotDto = z.infer<typeof lotDtoSchema>;
