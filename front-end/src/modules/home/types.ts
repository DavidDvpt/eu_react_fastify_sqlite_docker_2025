import type { Item } from "@/shared/types";

export type RunningSellItem = {
  groupKey: string;
  sessionId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  tt: number;
  ttc: number;
  saleStatus: "RUNNING";
  lineStatus: "OPENNED" | "CLOSED" | "ARCHIVED";
  sessionLineIds: string[];
} & {
  item: Item | null;
};
