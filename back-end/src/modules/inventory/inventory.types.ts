type InventoryByItemRow = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type InventoryLotInRow = {
  id: string;
  lotType: string;
  quantityRemaining: number;
  quantityInitial: number;
  transactionStatus: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
  lineStatus: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
  quantityExported: number;
  priceRemaining: number;
  dateCreated: string;
};

type InventoryLotOutRow = {
  id: string;
  dateCreated: string;
  quantity: number;
  lineStatus: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
  transactionStatus: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
  tt: number;
  ttc: number;
  saleStatus: string | null;
};

type InventoryItemDetails = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  lotsIn: InventoryLotInRow[];
  lotsOut: InventoryLotOutRow[];
};

type StockAvailabilityRow = {
  itemId: string;
  availableQuantity: number;
};

type SellableLotRow = {
  id: string;
  itemId: string;
  quantityRemaining: number;
  quantityExported: number;
  priceRemaining: number;
  dateCreated: string;
};

type SellItemData = {
  id: string;
  unitPrice: number;
  isStackable: boolean;
};

type SellTotals = {
  initialWinTt: number;
  initialWinTtc: number;
};

type SellProcessingResult = {
  processed: {
    itemId: string;
    quantity: number;
  }[];
  rejected: {
    itemId: string;
    requestedQuantity: number;
    availableQuantity: number;
    reason: string;
  }[];
  totalTt: number;
  totalTtc: number;
};

export type {
  InventoryByItemRow,
  InventoryLotInRow,
  InventoryLotOutRow,
  InventoryItemDetails,
  StockAvailabilityRow,
  SellableLotRow,
  SellItemData,
  SellTotals,
  SellProcessingResult,
};
