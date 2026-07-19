import type { TransactionDto } from '@eu/types';

export type TransactionBodyInput = Pick<
  TransactionDto,
  'itemId' | 'quantity' | 'tt' | 'fee' | 'ttc'
>;
