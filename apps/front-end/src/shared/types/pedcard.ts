export type PedCardCheckResponse = {
  message: string;
};

export type PedCardBalanceResponse = {
  balance: number;
};

export type PedCardCreateBody = {
  value: number;
  type: string;
};

export type PedCardResult = {
  hasInitialBalance: boolean;
  balance: number | null;
};

export type PedCardFormValues = {
  updatedValue: number;
};

export type PedCardSummaryRow = {
  key: string;
  label: string;
  amount: number;
};
