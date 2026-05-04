import type { Item, TransactionFilterRow } from "@/shared/types";

export interface ItemInventory extends Item {
  quantity: number;
  totalValue: number;
}

export type InventoryTransactionModalProps = {
  isOpen: boolean;
  action?: string;
  transactionItem: TransactionFilterRow | null;
  onClose: () => void;
};
