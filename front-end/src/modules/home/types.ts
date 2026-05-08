import type { RunningSellLine } from "@/modules/transactions/types";
import type { Item } from "@/shared/types";

export type RunningSellItem = RunningSellLine & {
  item: Item | null;
};
