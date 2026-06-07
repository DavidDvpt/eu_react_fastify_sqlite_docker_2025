import type { Item } from "@/shared/types";

export type RunningSellItem = {
  groupKey: string;
  transactionId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  tt: number;
  ttc: number;
  saleStatus: "RUNNING";
  lineStatus: "OPENNED" | "CLOSED" | "ARCHIVED";
  transactionLotIds: string[];
} & {
  item: Item | null;
};
