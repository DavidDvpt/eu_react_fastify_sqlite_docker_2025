import type { ItemDto } from "./item.js";
import { z } from "zod";
import {
  transactionBodySchema,
  transactionStatusSchema,
  transactionTypeSchema,
} from "@eu/zod-schemas";

export type TransactionStatusDto = z.output<typeof transactionStatusSchema>;

export type TransactionTypeDto = z.output<typeof transactionTypeSchema>;

export type TransactionStatusOutput = z.output<typeof transactionStatusSchema>;

export type TransactionFormIntputBody = z.input<typeof transactionBodySchema>;
export type TransactionFormOutputBody = z.output<typeof transactionBodySchema>;
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

export type RunningTransactionDtos = RunningTransactionDto[];
export type TransactionDtos = TransactionDto[];
