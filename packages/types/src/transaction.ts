import { z } from "zod";
import {
  transactionBodySchema,
  transactionEntriesSchema,
  transactionEntrySchema,
  transactionSchemaDto,
  transactionStatusPatchDtoSchema,
  transactionStatusDtoSchema,
  transactionCancelDtoSchema,
  transactionQuerySchema,
  transactionValuesSchema,
} from "@eu/zod-schemas";
import type { transactionTypeSchema } from "../../zodSchemas/src/transactionTypeSchema.js";

export type TransactionTypeDto = z.output<typeof transactionTypeSchema>;
export type TransactionStatusDto = z.output<typeof transactionStatusDtoSchema>;
export type TransactionStatusPatchDto = z.infer<
  typeof transactionStatusPatchDtoSchema
>;
export type TransactionCancelDto = z.infer<typeof transactionCancelDtoSchema>;

export type TransactionQuerySchema = z.infer<typeof transactionQuerySchema>;

export type TransactionEntry = z.infer<typeof transactionEntrySchema>;
export type TransactionEntries = z.infer<typeof transactionEntriesSchema>;
export type TransactionDto = z.infer<typeof transactionSchemaDto>;
export type TransactionValues = z.infer<typeof transactionValuesSchema>;
export type TransactionWhereOptions = {
  status?: TransactionStatusDto;
  type?: TransactionTypeDto;
  itemId?: string;
  withItemId?: boolean;
  withLotId?: boolean;
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

export type TransactionBodyDto = z.infer<typeof transactionBodySchema>;

export type TransatcionPatchDto = Omit<TransactionBodyDto, "status"> & {
  status: TransactionStatusPatchDto;
};

export type RunningTransactionDtos = RunningTransactionDto[];
export type TransactionDtos = TransactionDto[];
