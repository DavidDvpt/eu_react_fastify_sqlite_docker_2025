import type { RunningSellLine } from "@/modules/transactions/transaction.api";
import type { Item } from "@/shared/types";

export type RunningSellItem = RunningSellLine & {
  item: Item | null;
};
