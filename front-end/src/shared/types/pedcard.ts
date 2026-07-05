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
