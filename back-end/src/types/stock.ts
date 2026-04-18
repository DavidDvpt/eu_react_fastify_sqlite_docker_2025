type StockByItemRow = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type StockLotInRow = {
  id: string;
  lotType: string;
  quantityRemaining: number;
  quantityInitial: number;
  quantityExported: number;
  priceRemaining: number;
  dateCreated: string;
};

type StockLotOutRow = {
  id: string;
  dateCreated: string;
  quantity: number;
  tt: number;
  ttc: number;
  saleStatus: string | null;
};

type StockItemDetails = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  lotsIn: StockLotInRow[];
  lotsOut: StockLotOutRow[];
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
  StockByItemRow,
  StockLotInRow,
  StockLotOutRow,
  StockItemDetails,
  StockAvailabilityRow,
  SellableLotRow,
  SellItemData,
  SellTotals,
  SellProcessingResult,
};
