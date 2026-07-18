import { Button } from "@/components/ui/button";

import { Section, SubSection } from "../Containers";
import SelectRHF from "../form/Select/SelectRHF";

import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import type { FilterKeys, GenericFilterProps } from "@/shared/types";
import useGenericFilterContext from "./useGenericFilterContext";
import useGenericFilterParams from "./useGenericFilterParams";
import { useGenericFilterData } from "./useGenericFilterData";

function GenericFilter({ className, context }: GenericFilterProps) {
  const { params, constructQuery } = useGenericFilterParams();
  const { categoriesForSelect, typesForSelect, itemsForSelect } =
    useGenericFilterData({ params });

  const displayedFields = useGenericFilterContext({ context });
  const location = useLocation();
  const navigate = useNavigate();

  const updateValue = (key: FilterKeys, value: string | undefined) => {
    let q = "";

    if (key !== "reset") {
      q = constructQuery(key, value);
    }

    navigate({
      pathname: location.pathname,
      search: q,
    });
  };

  const filterItemClassName = "min-w-0 basis-[220px] grow";

  return (
    <Section
      className={cn("flex flex-col gap-2", className)}
      aria-label="Filtres"
    >
      <SubSection
        className="flex flex-row flex-wrap gap-4"
        aria-label="Filtres de sélection"
      >
        {displayedFields.category && (
          <div className={filterItemClassName}>
            <SelectRHF
              options={categoriesForSelect}
              onValueChange={(value) => updateValue("category", value)}
              placeholder="Choisir une categorie ..."
              value={params.category}
            />
          </div>
        )}

        {displayedFields.type && (
          <div className={filterItemClassName}>
            <SelectRHF
              options={typesForSelect}
              onValueChange={(value) => updateValue("type", value)}
              placeholder="Choisir un type ..."
              value={params.type}
            />
          </div>
        )}

        {displayedFields.item && (
          <div className={filterItemClassName}>
            <SelectRHF
              options={itemsForSelect}
              onValueChange={(value) => updateValue("item", value)}
              placeholder="Choisir un item"
              value={params.item}
              hasAutocomplete
            />
          </div>
        )}
      </SubSection>
      <div className="flex flex-end">
        <Button
          type="button"
          variant="ternary"
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
