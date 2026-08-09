// import type { StockDetails, StockDetailsApi } from "@/shared/types";

// function toNumber(value: number | string): number {
//   const parsed = Number(value);
//   if (!Number.isFinite(parsed)) {
//     return 0;
//   }
//   return parsed;
// }

// function parseStockDetails(details: StockDetailsApi): StockDetails {
//   return {
//     ...parseStockRow(details),
//     lotsIn: details.lotsIn.map((lot) => ({
//       id: lot.id,
//       lotType: lot.lotType,
//       quantityRemaining: toNumber(lot.quantityRemaining),
//       quantityInitial: toNumber(lot.quantityInitial),
//       quantityExported: toNumber(lot.quantityExported),
//       priceRemaining: toNumber(lot.priceRemaining),
//       dateCreated: lot.dateCreated,
//       transactionStatus: lot.transactionStatus,
//     })),
//     lotsOut: details.lotsOut.map((line) => ({
//       id: line.id,
//       dateCreated: line.dateCreated,
//       quantity: toNumber(line.quantity),
//       tt: toNumber(line.tt),
//       ttc: toNumber(line.ttc),
//       saleStatus: line.saleStatus,
//       transactionStatus: line.transactionStatus,
//     })),
//   };
// }

// export { parseStock, parseStockDetails, parseStockRow };
export {};
