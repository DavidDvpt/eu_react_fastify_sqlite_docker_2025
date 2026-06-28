import type { Item, TransactionAction, TransactionFilterRow } from "@/shared/types";

export interface ItemInventory extends Item {
  quantity: number;
  totalValue: number;
}

export type InventoryTransactionModalProps = {
  isOpen: boolean;
  action?: TransactionAction;
  transactionItem: TransactionFilterRow | null;
  onClose: () => void;
};
