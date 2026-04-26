import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Section, SubSection } from "../Containers";
import { useCategories, useItems, useTypes } from "@/shared/hooks";
import AppSelect from "../form/Select/AppSelect";

import { cn } from "@/lib/utils";
import type { Item } from "@/shared/types";

interface GenericFilterProps {
  hasAutocomplete?: boolean;
  className?: string;
  selectedItem?: Item;
  onSelectedItem?: (item: string) => void;
}

type SelectedFilterValues = {
  category: string;
  type: string;
  item: string;
  pattern?: string;
};

const allOptionValue = "__all__";
const filterDefaultValues: SelectedFilterValues = {
  category: allOptionValue,
  type: allOptionValue,
  item: allOptionValue,
  pattern: "",
};

function GenericFilter({ className, onSelectedItem }: GenericFilterProps) {
  const [selected, setSelected] =
    useState<SelectedFilterValues>(filterDefaultValues);

  const categories = useCategories();
  const types = useTypes();
  const items = useItems();

  const updateValue = (key: string, value: string | null) => {
    setSelected((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "item" && onSelectedItem && value) {
      onSelectedItem(value);
    }
  };

  return (
    <Section
      className={cn("flex flex-col gap-4", className)}
      aria-label="Filtres"
    >
      <SubSection
        className="flex flex-nowrap justify-between gap-4"
        aria-label="Filtres de sélection"
      >
        <AppSelect
          options={categories.categoriesForSelect}
          onValueChange={(value) => updateValue("category", value)}
          placeholder="Choisir une categorie ..."
          value={
            selected.category === allOptionValue ? undefined : selected.category
          }
        />

        <AppSelect
          options={types.typesForSelect(selected.category)}
          onValueChange={(value) => updateValue("type", value)}
          placeholder="Choisir un type ..."
          value={selected.type === allOptionValue ? undefined : selected.type}
        />

        <AppSelect
          options={items.itemsForSelect({
            typeId: selected.type,
            pattern: selected.pattern,
          })}
          onValueChange={(value) => updateValue("item", value)}
          placeholder="Choisir un item"
          value={selected.item === allOptionValue ? undefined : selected.item}
          hasAutocomplete
        />
      </SubSection>
      <div className="flex flex-end">
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="ml-auto w-[100px]"
          onClick={() => setSelected(filterDefaultValues)}
        >
          Reset
        </Button>
      </div>
    </Section>
  );
}

export { GenericFilter };
