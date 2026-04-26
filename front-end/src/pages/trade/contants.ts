import type { GenericFilterModel, TradeFilterRow } from "@/shared/types";

const TRADE_ITEM_FILTER_MODEL: GenericFilterModel<TradeFilterRow> = {
  fields: [
    {
      key: "category",
      label: "Categorie",
      kind: "select",
      allLabel: "Toutes les categories",
      dependsOn: ["type", "item", "search"],
      getValue: (row) => row.categoryId,
      getLabel: (row) => row.categoryName ?? row.categoryId,
    },
    {
      key: "type",
      label: "Type",
      kind: "select",
      allLabel: "Tous les types",
      dependsOn: ["category", "item", "search"],
      getValue: (row) => row.itemTypeId,
      getLabel: (row) => row.itemTypeName ?? row.itemTypeId,
    },
    {
      key: "item",
      label: "Item",
      kind: "select",
      allLabel: "Selectionner un item",
      dependsOn: ["category", "type", "search"],
      getValue: (row) => row.itemId,
      getLabel: (row) => row.name,
    },
    {
      key: "search",
      label: "Nom",
      kind: "autocomplete",
      placeholder: "Ex: Oil",
      getValue: (row) => row.name,
    },
  ],
};

export { TRADE_ITEM_FILTER_MODEL };
