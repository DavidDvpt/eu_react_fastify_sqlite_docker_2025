import type { ItemDto } from "./item.js";
import { z } from "zod";
import { transactionBodySchema } from "@eu/zod-schemas";

export type TransactionStatusDto = "SOLDED" | "RUNNING" | "RETURNED";

export type TransactionTypeDto =
  "PURCHASE" | "FOUND" | "GIFT" | "EXISTING_STOCK" | "SELL" | "GIVEN";

export type TransactionIntputBody = z.input<typeof transactionBodySchema>;
export type TransactionOutputBody = z.output<typeof transactionBodySchema>;
export interface RunningTransactionDto {
  id: string;
  itemId: string;
  quantity: number;
  tt: number;
  fee: number;
  ttc: number;
  status: TransactionStatusDto;
  createdAt: string;
}
export type RunningTransactionDtos = RunningTransactionDto[];

export interface TransactionDto extends RunningTransactionDto {
  transactionType: TransactionTypeDto;
  updatedAt: string | null;
  item?: ItemDto;
  lotIds?: any;
}

export type TransactionBodyDto = Omit<
  TransactionDto,
  "createdAt" | "updatedAt" | "item" | "lotIds" | "id"
> & { id?: string };

export type TransatcionPatchDto = Omit<TransactionDto, "item" | "lotIds">;

export type TransactionDtos = TransactionDto[];
