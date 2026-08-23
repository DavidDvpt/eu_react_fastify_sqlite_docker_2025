import { NumberHelper } from '@eu/helpers';

import type {
  FinancialInventoryReport,
  FinancialItemReport,
  TransactionEntries,
  TransactionValues,
} from '@eu/types';

const defaultValue: TransactionValues = { tt: 0, fee: 0, ttc: 0 };

const addValues = (target: TransactionValues, values: TransactionValues) => {
  target.tt = NumberHelper.round(target.tt + values.tt);
  target.fee = NumberHelper.round((target.fee ?? 0) + (values.fee ?? 0));
  target.ttc = NumberHelper.round(target.ttc + values.ttc);
};

export function toItemFinancialReport(rows: TransactionEntries) {
  const defaultItemValue: FinancialItemReport = {
    in: {
      BUY: { ...defaultValue },
      EXISTING_STOCK: { ...defaultValue },
      FOUND: { ...defaultValue },
      GIFT: { ...defaultValue },
      GIVEN: { ...defaultValue },
    },
    out: {
      RUNNING: { ...defaultValue },
      SOLDED: { ...defaultValue },
      RETURNED: { ...defaultValue },
      CANCELED: { ...defaultValue },
    },
    totalIn: { ...defaultValue },
    totalOut: { ...defaultValue },
    inCount: {
      BUY: 0,
      EXISTING_STOCK: 0,
      FOUND: 0,
      GIFT: 0,
      GIVEN: 0,
    },
    outCount: {
      RUNNING: 0,
      SOLDED: 0,
      RETURNED: 0,
      CANCELED: 0,
    },
  };

  const parsed = rows.reduce<FinancialItemReport>((acc, c) => {
    const values: TransactionValues = {
      tt: NumberHelper.round(c.tt),
      fee: NumberHelper.round(c.fee),
      ttc: NumberHelper.round(c.ttc),
    };

    if (c.transactionType === 'SELL') {
      if (!c.status) return acc;

      addValues(acc.out[c.status], values);
      if (c.status === 'SOLDED') {
        addValues(acc.totalOut, values);
      }

      acc.outCount[c.status] += 1;
      return acc;
    }

    addValues(acc.in[c.transactionType], values);
    addValues(acc.totalIn, values);

    acc.inCount[c.transactionType] += 1;
    return acc;
  }, defaultItemValue);

  return parsed;
}

export function toInventoryFinancialReport(rows: TransactionEntries) {
  const defaultItemValue: FinancialInventoryReport = {
    totalIn: { ...defaultValue },
    totalOut: { ...defaultValue },
    inCount: {
      BUY: 0,
      EXISTING_STOCK: 0,
      FOUND: 0,
      GIFT: 0,
      GIVEN: 0,
    },
    outCount: {
      RUNNING: 0,
      SOLDED: 0,
      RETURNED: 0,
      CANCELED: 0,
    },
  };
  const parsed = rows.reduce<FinancialInventoryReport>((acc, c) => {
    const values: TransactionValues = {
      tt: NumberHelper.round(c.tt),
      fee: NumberHelper.round(c.fee),
      ttc: NumberHelper.round(c.ttc),
    };

    if (c.transactionType === 'SELL') {
      if (!c.status) return acc;
      if (c.status === 'SOLDED') addValues(acc.totalOut, values);
      if (c.status === 'RETURNED') {
        acc.totalOut.fee = NumberHelper.round(acc.totalOut.fee + values.fee);
      }

      acc.outCount[c.status] += 1;

      return acc;
    }

    addValues(acc.totalIn, values);

    acc.inCount[c.transactionType] += 1;
    return acc;
  }, defaultItemValue);

  return parsed;
}
