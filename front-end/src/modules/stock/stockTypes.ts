type StockRowApi = {
  itemId: string;
  imageUrlId: string;
  name: string;
  quantity: number | string;
  totalPrice: number | string;
};

type StockRow = {
  itemId: string;
  imageUrlId: string;
  name: string;
  quantity: number;
  totalPrice: number;
};

type StockApi = StockRowApi[];
type Stock = StockRow[];

export type { Stock, StockApi, StockRow, StockRowApi };
