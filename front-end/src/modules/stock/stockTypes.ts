type StockRowApi = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number | string;
  quantity: number | string;
  totalPrice: number | string;
};

type StockRow = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type StockApi = StockRowApi[];
type Stock = StockRow[];

type StockLotInApi = {
  id: string;
  lotType: string;
  quantityRemaining: number | string;
  quantityExported: number | string;
  priceRemaining: number | string;
  dateCreated: string;
};

type StockLotIn = {
  id: string;
  lotType: string;
  quantityRemaining: number;
  quantityExported: number;
  priceRemaining: number;
  dateCreated: string;
};

type StockLotOutApi = {
  dateCreated: string;
  quantity: number | string;
  tt: number | string;
  ttc: number | string;
  saleStatus: string | null;
};

type StockLotOut = {
  dateCreated: string;
  quantity: number;
  tt: number;
  ttc: number;
  saleStatus: string | null;
};

type StockDetailsApi = StockRowApi & {
  lotsIn: StockLotInApi[];
  lotsOut: StockLotOutApi[];
};

type StockDetails = StockRow & {
  lotsIn: StockLotIn[];
  lotsOut: StockLotOut[];
};

export type {
  Stock,
  StockApi,
  StockDetails,
  StockDetailsApi,
  StockLotIn,
  StockLotInApi,
  StockLotOut,
  StockLotOutApi,
  StockRow,
  StockRowApi,
};
