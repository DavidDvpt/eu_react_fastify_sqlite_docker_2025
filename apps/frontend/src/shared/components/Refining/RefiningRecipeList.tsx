import CapsuleLoader from "@/shared/components/CapsuleLoader";
import { formLabelClassName } from "@/shared/components/form/form.styles";
import RefiningRecipeOption from "./RefiningRecipeOption";
import type { RefiningRecipeOptionData } from "./refiningTypes";

type RefiningRecipeListProps = {
  options: RefiningRecipeOptionData[];
  isPending: boolean;
  isLinesPending: boolean;
  hasError: boolean;
  selectedResultId: string | null;
  onSelect: (resultId: string) => void;
};

function RefiningRecipeList({
  options,
  isPending,
  isLinesPending,
  hasError,
  selectedResultId,
  onSelect,
}: RefiningRecipeListProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className={formLabelClassName}>Recettes</span>

      {isPending ? (
        <div className="flex h-12 items-center justify-center">
          <CapsuleLoader title="Chargement des recettes..." />
        </div>
      ) : hasError ? (
        <p className="m-0 text-sm text-error-500">
          Impossible de charger les recettes.
        </p>
      ) : isLinesPending ? (
        <div className="flex h-12 items-center justify-center">
          <CapsuleLoader title="Vérification du stock..." />
        </div>
      ) : options.length === 0 ? (
        <p className="m-0 text-sm text-text-muted">
          Aucune recette disponible pour cet item.
        </p>
      ) : (
        <div className="flex h-[132px] flex-col gap-1 overflow-y-auto rounded-md border border-border">
          {options.map((option) => (
            <RefiningRecipeOption
              key={option.resultId}
              {...option}
              selected={option.resultId === selectedResultId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RefiningRecipeList;
