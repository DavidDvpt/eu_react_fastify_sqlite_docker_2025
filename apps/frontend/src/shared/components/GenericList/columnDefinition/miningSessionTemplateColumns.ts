import { NumberHelper } from "@/shared/helpers";
import type { GenericListColumn } from "@/shared/types";
import type { MiningSessionTableRow } from "@/shared/types/mining";

const miningSessionColumns: GenericListColumn<MiningSessionTableRow>[] = [
  {
    key: "index",
    label: "#",
    minWidth: 36,
    align: "center",
    value: (row) => row.index,
  },
  {
    key: "clickCount",
    label: "Clics",
    minWidth: 44,
    align: "right",
    value: (row) => row.clickCount ?? "—",
  },
  {
    key: "type",
    label: "Type",
    minWidth: 52,
    align: "center",
    value: (row) => row.searchType ?? "—",
  },
  {
    key: "finder",
    label: "Finder",
    minWidth: 180,
    fillRemainingSpace: true,
    value: (row) => row.finder ?? "—",
  },
  {
    key: "amp",
    label: "Amp",
    minWidth: 52,
    align: "center",
    value: (row) => (row.amp ? "Oui" : "Non"),
  },
  {
    key: "costTt",
    label: "Coût TT",
    minWidth: 64,
    align: "right",
    value: (row) => NumberHelper.formatNumber(row.costTt),
  },
  {
    key: "costTtc",
    label: "Coût TTC",
    minWidth: 64,
    align: "right",
    value: (row) => NumberHelper.formatNumber(row.costTtc),
  },
  {
    key: "costBalance",
    label: "Bilan TT",
    minWidth: 64,
    align: "right",
    value: (row) =>
      `${NumberHelper.formatPercent(row.costTt ? (row.costTtc / row.costTt) * 100 : 0)}%`,
  },
  {
    key: "resultTt",
    label: "Résultat TT",
    minWidth: 64,
    align: "right",
    value: (row) => NumberHelper.formatNumber(row.resultTt),
  },
  {
    key: "resultTtc",
    label: "Résultat TTC",
    minWidth: 64,
    align: "right",
    value: (row) => NumberHelper.formatNumber(row.resultTtc),
  },
  {
    key: "resultBalance",
    label: "Bilan TTC",
    minWidth: 64,
    align: "right",
    value: (row) =>
      `${NumberHelper.formatPercent(row.resultTt ? (row.resultTtc / row.resultTt) * 100 : 0)}%`,
  },
  {
    key: "balanceTt",
    label: "Bilan TT",
    minWidth: 76,
    align: "right",
    value: (row) => NumberHelper.formatNumber(row.resultTt - row.costTt),
  },
  {
    key: "balanceTtc",
    label: "Bilan TTC",
    minWidth: 76,
    align: "right",
    value: (row) => NumberHelper.formatNumber(row.resultTtc - row.costTtc),
  },
  {
    key: "balancePercent",
    label: "Bilan %",
    minWidth: 72,
    align: "right",
    value: (row) =>
      `${NumberHelper.formatPercent(row.resultTtc > 0 && row.costTtc ? (row.resultTtc / row.costTtc) * 100 : 0)}%`,
  },
];

export default miningSessionColumns;
