import type { GenericFilterModel } from "./types";

type TypeFilterModelItem = {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
};

function createTypeFilterModel<T extends TypeFilterModelItem>(): GenericFilterModel<T> {
  return {
    fields: [
      {
        key: "category",
        label: "Categorie",
        kind: "select",
        allLabel: "Toutes les categories",
        dependsOn: ["search"],
        getValue: (type) => type.categoryId,
        getLabel: (type) => type.categoryName ?? type.categoryId,
      },
      {
        key: "search",
        label: "Nom",
        kind: "autocomplete",
        placeholder: "Ex: Ore",
        getValue: (type) => type.name,
      },
    ],
  };
}

type ItemFilterModelItem = {
  id: string;
  name: string;
  itemTypeId: string;
  itemTypeName?: string;
  isLimited: boolean;
};

function createItemFilterModel<
  TItem extends ItemFilterModelItem,
  TType extends TypeFilterModelItem,
>(typeById: Record<string, TType>): GenericFilterModel<TItem> {
  return {
    fields: [
      {
        key: "category",
        label: "Categorie",
        kind: "select",
        allLabel: "Toutes les categories",
        dependsOn: ["limited", "search"],
        getValue: (item) => typeById[item.itemTypeId]?.categoryId ?? null,
        getLabel: (item) => {
          const linkedType = typeById[item.itemTypeId];
          if (!linkedType) return "Type introuvable";
          return linkedType.categoryName ?? linkedType.categoryId;
        },
      },
      {
        key: "type",
        label: "Type",
        kind: "select",
        allLabel: "Tous les types",
        dependsOn: ["category", "limited", "search"],
        getValue: (item) => item.itemTypeId,
        getLabel: (item) =>
          item.itemTypeName ?? typeById[item.itemTypeId]?.name ?? item.itemTypeId,
      },
      {
        key: "limited",
        label: "Limited",
        kind: "boolean",
        allLabel: "Tous",
        trueLabel: "Limite",
        falseLabel: "Illimite",
        getValue: (item) => item.isLimited,
      },
      {
        key: "search",
        label: "Nom",
        kind: "autocomplete",
        placeholder: "Ex: Oil",
        getValue: (item) => item.name,
      },
    ],
  };
}

export { createItemFilterModel, createTypeFilterModel };
