import type { GenericFilterModel } from "./types";

type TypeFilterModelItem = {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  isActive?: boolean;
  isStackable?: boolean;
};

function createTypeFilterModel<T extends TypeFilterModelItem>(): GenericFilterModel<T> {
  return {
    fields: [
      {
        key: "category",
        label: "Categorie",
        kind: "select",
        allLabel: "Toutes les categories",
        dependsOn: ["isActive", "search"],
        getValue: (type) => type.categoryId,
        getLabel: (type) => type.categoryName ?? type.categoryId,
      },
      {
        key: "isActive",
        label: "Actif",
        kind: "boolean",
        allLabel: "Tous",
        trueLabel: "Actif",
        falseLabel: "Inactif",
        getValue: (type) => type.isActive ?? true,
      },
      {
        key: "stackable",
        label: "Stackable",
        kind: "boolean",
        trueLabel: "Stackable",
        falseLabel: "Non stackable",
        getValue: (type) => type.isStackable ?? false,
      },
      {
        key: "search",
        label: "Nom (autocomplete)",
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
  isActive?: boolean;
  isLimited: boolean;
  isStackable?: boolean;
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
        dependsOn: ["isActive", "limited", "stackable", "search"],
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
        dependsOn: ["category", "isActive", "limited", "stackable", "search"],
        getValue: (item) => item.itemTypeId,
        getLabel: (item) =>
          item.itemTypeName ?? typeById[item.itemTypeId]?.name ?? item.itemTypeId,
      },
      {
        key: "isActive",
        label: "Actif",
        kind: "boolean",
        allLabel: "Tous",
        trueLabel: "Actif",
        falseLabel: "Inactif",
        getValue: (item) => item.isActive ?? true,
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
        key: "stackable",
        label: "Stackable",
        kind: "boolean",
        trueLabel: "Stackable",
        falseLabel: "Non stackable",
        getValue: (item) => item.isStackable ?? false,
      },
      {
        key: "search",
        label: "Nom (autocomplete)",
        kind: "autocomplete",
        placeholder: "Ex: Oil",
        getValue: (item) => item.name,
      },
    ],
  };
}

export { createItemFilterModel, createTypeFilterModel };
