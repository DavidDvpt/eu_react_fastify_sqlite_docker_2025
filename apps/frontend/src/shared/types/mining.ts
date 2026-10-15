import type { MiningSessionHistoryResponse } from "@/api/generated/zod/model";

export type MiningSessionTableRow = MiningSessionHistoryResponse & {
  index: number;
};
