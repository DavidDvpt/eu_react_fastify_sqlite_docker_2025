import { Button } from "@/components/ui/button";

import { Section, SubSection } from "../Containers";
import AppSelect from "../form/Select/AppSelect";

import { cn } from "@/lib/utils";
import useGenericFilterParams from "@/shared/hooks/useGenericFilterParams";
import { useLocation, useNavigate } from "react-router-dom";
import type { FilterKeys, GenericFilterProps } from "@/shared/types";
import { useGenericFilterData } from "@/shared/hooks/useGenericFilterData";

function GenericFilter({ className }: GenericFilterProps) {
  const { params, constructQuery } = useGenericFilterParams();
  const { categoriesForSelect, typesForSelect, itemsForSelect } =
    useGenericFilterData(params);
  const location = useLocation();
  const navigate = useNavigate();

  const updateValue = (key: FilterKeys, value: string | undefined) => {
    let q = "";

    // On vérifie si ce n'est pas "reset" pour appeler constructQuery
    if (key !== "reset") {
      // Note : assurez-vous que constructQuery attend bien (key, value)
      // Dans votre code original, il semblait prendre ces args.
      q = constructQuery(key, value);
    }
    console.log(key, q);
    navigate({
      pathname: location.pathname,
      search: q,
    });
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
          options={categoriesForSelect}
          onValueChange={(value) => updateValue("category", value)}
          placeholder="Choisir une categorie ..."
          value={params.category}
        />

        <AppSelect
          options={typesForSelect}
          onValueChange={(value) => updateValue("type", value)}
          placeholder="Choisir un type ..."
          value={params.type}
        />

        <AppSelect
          options={itemsForSelect}
          onValueChange={(value) => updateValue("item", value)}
          placeholder="Choisir un item"
          value={params.item}
          hasAutocomplete
        />
      </SubSection>
      <div className="flex flex-end">
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="ml-auto w-[100px]"
          onClick={() => updateValue("reset", undefined)}
        >
          Reset
        </Button>
      </div>
    </Section>
  );
}

export { GenericFilter };
