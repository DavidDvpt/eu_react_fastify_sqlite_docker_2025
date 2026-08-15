import { z } from "zod";
import {
  transactionBodySchema,
  transactionSchemaDto,
  transactionStatusPatchDtoSchema,
  transactionStatusDtoSchema,
  transactionCancelDtoSchema,
  transactionQuerySchema,
} from "@eu/zod-schemas";
import type { transactionTypeSchema } from "../../zodSchemas/src/transactionTypeSchema.js";

export type TransactionTypeDto = z.output<typeof transactionTypeSchema>;
export type TransactionStatusDto = z.output<typeof transactionStatusDtoSchema>;
export type TransactionStatusPatchDto = z.infer<
  typeof transactionStatusPatchDtoSchema
>;
export type TransactionCancelDto = z.infer<typeof transactionCancelDtoSchema>;

export type TransactionQuerySchema = z.infer<typeof transactionQuerySchema>;

export type TransactionDto = z.infer<typeof transactionSchemaDto>;

export type TransactionWhereOptions = {
  status?: TransactionStatusDto;
  type?: TransactionTypeDto;
  itemId?: string;
};

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

export type TransactionBodyDto = Omit<
  TransactionDto,
  "createdAt" | "updatedAt" | "item" | "lotIds" | "id"
> & { id?: string };

export type TransatcionPatchDto = Omit<
  TransactionDto,
  "item" | "lotIds" | "status"
> & { status: TransactionStatusPatchDto };

export type RunningTransactionDtos = RunningTransactionDto[];
export type TransactionDtos = TransactionDto[];
