import type { sortOrderEnum } from "@eu/zod-schemas";
import { z } from "zod";

export type PrismaMutationResponse = { id: string };

export type Order = z.infer<typeof sortOrderEnum>;

export type SortOptions<T> = { key: T; order?: Order } | undefined;
