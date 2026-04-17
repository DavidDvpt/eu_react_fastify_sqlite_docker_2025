import { useMemo } from "react";
import { GenericTable } from "@/shared/components";

import { GenericFilter } from "@/shared/components/GenericFilter";

import { stockColumns } from "./stockColumns";
import { FormatTools } from "@/shared/tools/formatTools";
import type {
  GenericFilterModel,
  StockFilterRow,
  StockPanelProps,
  StockRow,
} from "@/types";
import {
  useCategories,
  useGenericFilter,
  useItems,
  useTypes,
} from "@/shared/hooks";
import { STOCK_ROUTE } from "@/shared/services";

const STOCK_FILTER_MODEL: GenericFilterModel<StockFilterRow> = {
  fields: [
    {
      key: "category",
      label: "Categorie",
      kind: "select",
      allLabel: "Toutes les categories",
      dependsOn: ["type", "search"],
      getValue: (row) => row.categoryId,
      getLabel: (row) => row.categoryName ?? row.categoryId,
    },
    {
      key: "type",
      label: "Type",
      kind: "select",
      allLabel: "Tous les types",
      dependsOn: ["category", "search"],
      getValue: (row) => row.itemTypeId,
      getLabel: (row) => row.itemTypeName ?? row.itemTypeId,
    },
    {
      key: "limited",
      label: "Limited",
      kind: "boolean",
      allLabel: "Tous",
      trueLabel: "Limite",
      falseLabel: "Illimite",
      getValue: (row) => row.isLimited,
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

function StockPanel({
  rows,
  isLoading,
  isError,
  selectedItemId,
  onSelectItem,
  className,
}: StockPanelProps) {
  const {
    data: categories = [],
    isPending: categoriesPending,
    isError: categoriesError,
  } = useCategories();
  const {
    data: items = [],
    isPending: itemsPending,
    isError: itemsError,
  } = useItems();
  const {
    data: types = [],
    isPending: typesPending,
    isError: typesError,
  } = useTypes();

  const typeById = useMemo(
    () =>
      types.reduce<Record<string, (typeof types)[number]>>((acc, type) => {
        acc[type.id] = type;
        return acc;
      }, {}),
    [types],
  );

  const itemById = useMemo(
    () =>
      items.reduce<Record<string, (typeof items)[number]>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    [items],
  );

  const filterRows = useMemo<StockFilterRow[]>(
    () =>
      rows.map((row) => {
        const item = itemById[row.itemId];
        const itemType = item ? typeById[item.itemTypeId] : undefined;
        return {
          ...row,
          itemTypeId: item?.itemTypeId ?? null,
          itemTypeName: item?.itemTypeName ?? itemType?.name ?? null,
          categoryId: itemType?.categoryId ?? null,
          categoryName: itemType?.categoryName ?? null,
          isLimited: item?.isLimited ?? false,
        };
      }),
    [itemById, rows, typeById],
  );

  const availability = [
    {
      isPending: categoriesPending,
      isError: categoriesError,
      count: categories.length,
    },
    { isPending: typesPending, isError: typesError, count: types.length },
    { isPending: itemsPending, isError: itemsError, count: items.length },
  ];

  const {
    filter: stockFilter,
    filteredItems: filteredRows,
    showFilter,
    hasIsLimited,
  } = useGenericFilter<StockFilterRow>({
    items: filterRows,
    model: STOCK_FILTER_MODEL,
    allowedFields: ["category", "type", "search", "limited"],
    mode: "filter",
    hasIsLimited: true,
    typeById,
    availability,
  });

  const totalPrice = filteredRows.reduce((acc, row) => acc + row.totalPrice, 0);

  return (
    <div className={`flex h-full min-h-0 flex-col gap-2 ${className ?? ""}`}>
      {showFilter ? (
        <GenericFilter
          model={STOCK_FILTER_MODEL}
          filter={stockFilter}
          allowedFields={["category", "type", "search", "limited"]}
          hasAutocomplete
          hasIsLimited={hasIsLimited}
        />
      ) : null}

      <GenericTable<StockRow>
        columns={stockColumns}
        rows={filteredRows}
        getRowKey={(row) => row.itemId}
        onRowClick={(row) => onSelectItem(row.itemId)}
        isLoading={isLoading}
        isError={isError}
        loadingMessage="Chargement du stock..."
        errorMessage={`Impossible de charger le stock (endpoint attendu: ${STOCK_ROUTE}).`}
        emptyMessage="Aucun item en stock."
        className="flex-1 min-h-0"
        rowClassName={(row) =>
          [
            "hover:bg-muted/30 cursor-pointer",
            selectedItemId === row.itemId ? "bg-muted/40" : "",
          ].join(" ")
        }
        footer={`Total: ${FormatTools.pedFormat().format(totalPrice)} Peds`}
      />
    </div>
  );
}

export default StockPanel;
