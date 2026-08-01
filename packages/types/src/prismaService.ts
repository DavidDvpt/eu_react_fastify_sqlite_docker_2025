export type PrismaMutationResponse = { id: string };

export type Order = "asc" | "desc";

export type SortOptions<T> = { key: keyof T; order: Order };
