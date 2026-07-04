export type PedCardCheckResponse = {
  message: string;
};

export type PedCardBalanceResponse = {
  balance: number;
};

export type PedCardResult = {
  hasInitialBalance: boolean;
  balance: number | null;
};

export type PedCardFormValues = {
  updatedValue: number;
};
