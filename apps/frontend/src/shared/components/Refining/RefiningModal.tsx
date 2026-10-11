import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { ModalGeneric } from "@/shared/components/ModalGeneric";
import {
  REFINING_PROVENANCES,
  buildRefinageOriginPayload,
  computeRefinageMaxClickCount,
  getItemImageUrl,
  getRecipePpcm,
} from "@/shared/helpers";
import type { StockRow } from "@/shared/helpers/stock";
import { useInventoryStockData, useSystemDatas } from "@/shared/hooks/rqFetchHooks";
import {
  useRefinageRecipeLines,
  useRefinageResultsByOrigin,
} from "@/shared/hooks/rqFetchHooks/useRefiningRecipes";
import useRefiningMutation from "@/shared/hooks/useRefiningMutation";
import { refiningFormSchema, type RefiningFormValues } from "@/shared/schemas";

import RefiningRecipeList from "./RefiningRecipeList";
import type { RefiningRecipeOptionData } from "./refiningTypes";

type RefiningModalProps = { item: StockRow; onClose: () => void };
const PROVENANCE_LABELS = { TRADE: "Trade", MINING: "Minage", CRAFTING: "Crafting" } as const;

function RefiningFields({
  options, pending, linesPending, hasError, selectedResultId, onSelect, ppcm, maxClickCount,
}: {
  options: RefiningRecipeOptionData[];
  pending: boolean;
  linesPending: boolean;
  hasError: boolean;
  selectedResultId: string | null;
  onSelect: (id: string) => void;
  ppcm: number;
  maxClickCount: number;
}) {
  const form = useFormContext<RefiningFormValues>();
  return (
    <>
      <InputRHF name="result" type="hidden" />
      <RefiningRecipeList
        options={options}
        isPending={pending}
        isLinesPending={linesPending}
        hasError={hasError}
        selectedResultId={selectedResultId}
        onSelect={(id) => {
          onSelect(id);
          form.setValue("result", id, { shouldValidate: true });
          const option = options.find((candidate) => candidate.resultId === id);
          if (option) form.setValue("clickCount", option.maxClickCount, { shouldValidate: true });
        }}
      />
      {selectedResultId && maxClickCount > 0 ? (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Provenance</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {REFINING_PROVENANCES.map((provenance) => (
                <CheckboxRHF key={provenance} name="provenance" checkedValue={provenance} label={PROVENANCE_LABELS[provenance]} />
              ))}
            </div>
          </div>
          <InputRHF name="clickCount" label="Quantité (résultats)" type="number" min={ppcm} max={maxClickCount} step={ppcm} registerOptions={{ valueAsNumber: true }} />
          <p className="-mt-3 m-0 text-xs text-text-muted">Multiple de {ppcm} — maximum {maxClickCount} résultat{maxClickCount > 1 ? "s" : ""}</p>
        </>
      ) : null}
    </>
  );
}

function RefiningModal({ item, onClose }: RefiningModalProps) {
  const { items: { itemDatas } } = useSystemDatas();
  const { inventoryStock } = useInventoryStockData();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const resultsQuery = useRefinageResultsByOrigin(item.id);
  const resultIds = useMemo(() => resultsQuery.data ?? [], [resultsQuery.data]);
  const { recipeLinesByResult, isLinesLoading, isLinesError } = useRefinageRecipeLines(resultIds);
  const stockByItemId = useMemo(
    () => Object.fromEntries((inventoryStock ?? []).map((entry) => [entry.id, entry.stock])),
    [inventoryStock],
  );
  const recipeOptions = useMemo(() => resultIds.map((resultId) => {
    const lines = recipeLinesByResult.get(resultId) ?? [];
    const maxClickCount = computeRefinageMaxClickCount(lines, stockByItemId);
    const itemData = itemDatas?.find((candidate) => candidate.id === resultId);
    return {
      resultId,
      name: itemData?.name ?? resultId,
      imageUrl: itemData?.imageUrlId ? (getItemImageUrl(itemData.imageUrlId, "normal") ?? null) : null,
      maxClickCount,
      refinable: maxClickCount > 0,
    };
  }), [resultIds, recipeLinesByResult, stockByItemId, itemDatas]);
  const selectedOption = recipeOptions.find((option) => option.resultId === selectedResultId);
  const ppcm = selectedOption ? getRecipePpcm(recipeLinesByResult.get(selectedOption.resultId) ?? []) : 0;
  const schema = useMemo(() => refiningFormSchema.superRefine((values, context) => {
    if (ppcm > 0 && values.clickCount % ppcm !== 0) context.addIssue({ code: "custom", path: ["clickCount"], message: `Le nombre de résultats doit être un multiple de ${ppcm}.` });
    if (selectedOption && values.clickCount > selectedOption.maxClickCount) context.addIssue({ code: "custom", path: ["clickCount"], message: `Maximum ${selectedOption.maxClickCount} résultat(s) avec le stock disponible.` });
  }), [ppcm, selectedOption]);
  const { refineMutation } = useRefiningMutation();
  const onSubmit = async (values: RefiningFormValues) => {
    if (!selectedOption) return;
    const lines = recipeLinesByResult.get(selectedOption.resultId) ?? [];
    await refineMutation.mutateAsync({ itemId: item.id, result: values.result, clickCount: values.clickCount, origin: buildRefinageOriginPayload(lines), provenance: values.provenance });
    onClose();
  };

  return (
    <ModalGeneric dialogType="form" open onOpenChange={(open) => !open && onClose()} title={{ value: "Refinage", style: "m-0 text-2xl leading-tight" }} contentStyle="max-h-[85vh] overflow-y-auto">
      <GenericForm schema={schema} defaultValues={{ result: "", clickCount: 1, provenance: [...REFINING_PROVENANCES] }} onSubmit={onSubmit} className="flex min-w-0 flex-col gap-5 p-1">
        <RefiningFields options={recipeOptions} pending={resultsQuery.isLoading} linesPending={isLinesLoading && resultIds.length > 0} hasError={Boolean(resultsQuery.isError) || isLinesError} selectedResultId={selectedResultId} onSelect={setSelectedResultId} ppcm={ppcm} maxClickCount={selectedOption?.maxClickCount ?? 0} />
        <FormButtonsSection onCancel={onClose} submitDisabled={refineMutation.isPending || !selectedOption?.refinable} cancelDisabled={refineMutation.isPending} submitLabel={refineMutation.isPending ? "Refinage..." : "Refiner"} />
      </GenericForm>
    </ModalGeneric>
  );
}

export default RefiningModal;
