import type {
  FieldType,
  GenericFilterModel,
  GenericFilterModelItem,
} from "@/shared/types";

function enabledFields(tab: FieldType) {
  let values: FieldType[] = [];
  switch (tab) {
    case "type":
      values = ["category", "search"];
      break;
    case "item":
      values = ["category", "type", "search", "limited"];
      break;
    default:
      break;
  }

  return values;
}

function createGenericFilterModel<
  TItem extends GenericFilterModelItem,
>(): GenericFilterModel<TItem> {
  return {
    fields: [
      {
        key: "category",
        label: "Categorie",
        kind: "select",
        allLabel: "Toutes les categories",
        dependsOn: ["type", "item", "limited", "search"],
        getValue: (item) => item.categoryId ?? null,
        getLabel: (item) => item.categoryName ?? item.categoryId ?? null,
      },
      {
        key: "type",
        label: "Type",
        kind: "select",
        allLabel: "Tous les types",
        dependsOn: ["category", "item", "limited", "search"],
        getValue: (item) => item.itemTypeId ?? null,
        getLabel: (item) => item.itemTypeName ?? item.itemTypeId ?? null,
      },
      {
        key: "item",
        label: "Item",
        kind: "select",
        allLabel: "Selectionner un item",
        dependsOn: ["category", "type", "limited", "search"],
        getValue: (item) => item.itemId ?? null,
        getLabel: (item) => item.name ?? item.itemId ?? null,
      },
      {
        key: "limited",
        label: "Limited",
        kind: "boolean",
        allLabel: "Tous",
        trueLabel: "Limite",
        falseLabel: "Illimite",
        getValue: (item) => item.isLimited ?? false,
      },
      {
        key: "search",
        label: "Nom",
        kind: "autocomplete",
        placeholder: "Ex: Oil",
        getValue: (item) => item.name ?? "",
      },
    ],
  };
}

export { createGenericFilterModel, enabledFields };
