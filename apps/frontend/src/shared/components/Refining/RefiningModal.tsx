import { useMemo, useState } from "react";

import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { ModalGeneric } from "@/shared/components/ModalGeneric";
import {
  REFINING_PROVENANCES,
  buildRefinageCosts,
  computeRefinageMaxClickCountFromOriginStock,
  getItemImageUrl,
  getRecipePpcm,
} from "@/shared/helpers";
import type { StockRow } from "@/shared/helpers/stock";
import { useSystemDatas } from "@/shared/hooks/rqFetchHooks";
import {
  useRefinageRecipeLines,
  useRefinageResultsByOrigin,
  useRefinageOriginStocks,
} from "@/shared/hooks/rqFetchHooks/useRefiningRecipes";
import { useInventoryStockData } from "@/shared/hooks/rqFetchHooks";
import useRefiningMutation from "@/shared/hooks/useRefiningMutation";
import { refiningFormSchema, type RefiningFormValues } from "@/shared/schemas";

import RefiningProvenanceFields from "./RefiningProvenanceFields";
import RefiningQuantityField from "./RefiningQuantityField";
import RefiningRecipeField from "./RefiningRecipeField";
import RefiningRefinerSelect from "./RefiningRefinerSelect";

type RefiningModalProps = { item: StockRow; onClose: () => void };

function RefiningModal({ item, onClose }: RefiningModalProps) {
  const {
    items: { itemDatas },
  } = useSystemDatas();
  const { inventoryStock } = useInventoryStockData();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [selectedProvenances, setSelectedProvenances] = useState([
    ...REFINING_PROVENANCES,
  ]);
  const resultsQuery = useRefinageResultsByOrigin(item.id);
  const resultIds = useMemo(() => resultsQuery.data ?? [], [resultsQuery.data]);
  const { recipeLinesByResult, isLinesLoading, isLinesError } =
    useRefinageRecipeLines(resultIds);
  const { originStocksByResult, isOriginStocksLoading, isOriginStocksError } =
    useRefinageOriginStocks(resultIds, selectedProvenances);
  const recipeOptions = useMemo(
    () =>
      resultIds.map((resultId) => {
        const lines = recipeLinesByResult.get(resultId) ?? [];
        const maxAvailable = computeRefinageMaxClickCountFromOriginStock(
          originStocksByResult.get(resultId) ?? [],
        );
        const ppcm = getRecipePpcm(lines);
        const maxClickCount =
          ppcm > 0 ? maxAvailable - (maxAvailable % ppcm) : 0;
        const itemData = itemDatas?.find(
          (candidate) => candidate.id === resultId,
        );
        return {
          resultId,
          name: itemData?.name ?? resultId,
          imageUrl: itemData?.imageUrlId
            ? (getItemImageUrl(itemData.imageUrlId, "normal") ?? null)
            : null,
          maxClickCount,
          refinable: maxClickCount > 0,
        };
      }),
    [resultIds, recipeLinesByResult, originStocksByResult, itemDatas],
  );

  const refinerOptions = useMemo(
    () =>
      inventoryStock.flatMap((stockItem) => {
        const typeName = stockItem.type?.name?.toLowerCase() ?? "";
        const categoryName =
          stockItem.type?.category?.name?.toLowerCase() ?? "";
        const isRefiner =
          typeName.includes("refiner") ||
          typeName.includes("raffin") ||
          categoryName.includes("refiner") ||
          categoryName.includes("raffin");

        if (!isRefiner) return [];

        return (stockItem.lots ?? []).map((lot) => ({
          value: lot.lotId,
          label: (
            <span className="flex items-center gap-2">
              {stockItem.imageUrlId ? (
                <img
                  src={
                    getItemImageUrl(stockItem.imageUrlId, "micro") ?? undefined
                  }
                  alt=""
                  className="h-7 w-7 rounded object-contain"
                />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded bg-surface-hover text-xs text-text-muted">
                  -
                </span>
              )}
              <span className="truncate">{stockItem.name}</span>
            </span>
          ),
        }));
      }),
    [inventoryStock],
  );

  const selectedOption = recipeOptions.find(
    (option) => option.resultId === selectedResultId,
  );
  const ppcm = selectedOption
    ? getRecipePpcm(recipeLinesByResult.get(selectedOption.resultId) ?? [])
    : 0;
  const schema = useMemo(
    () =>
      refiningFormSchema.superRefine((values, context) => {
        if (ppcm > 0 && values.clickCount % ppcm !== 0)
          context.addIssue({
            code: "custom",
            path: ["clickCount"],
            message: `Le nombre de résultats doit être un multiple de ${ppcm}.`,
          });
        if (selectedOption && values.clickCount > selectedOption.maxClickCount)
          context.addIssue({
            code: "custom",
            path: ["clickCount"],
            message: `Maximum ${selectedOption.maxClickCount} résultat(s) avec le stock disponible.`,
          });
      }),
    [ppcm, selectedOption],
  );
  const { refineMutation } = useRefiningMutation();
  const onSubmit = async (values: RefiningFormValues) => {
    if (!selectedOption) return;
    await refineMutation.mutateAsync({
      itemId: item.id,
      resultItemId: values.result,
      clickCount: values.clickCount,
      resultQuantity: values.clickCount,
      costs: buildRefinageCosts(
        originStocksByResult.get(selectedOption.resultId) ?? [],
        values.clickCount,
      ).concat({ lotId: values.refinerLotId }),
    });
    onClose();
  };

  return (
    <ModalGeneric
      dialogType="form"
      open
      onOpenChange={(open) => !open && onClose()}
      title={{ value: "Refinage", style: "m-0 text-2xl leading-tight" }}
      contentStyle="!h-[min(620px,80vh)] !max-h-[80vh]"
    >
      <GenericForm
        schema={schema}
        defaultValues={{
          result: "",
          refinerLotId: "",
          clickCount: 1,
          provenance: [...REFINING_PROVENANCES],
        }}
        onSubmit={onSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 p-1"
      >
        <InputRHF name="result" type="hidden" />
        <div className="flex flex-col gap-y-4">
          <RefiningRecipeField
            options={recipeOptions}
            isPending={resultsQuery.isLoading}
            isLinesPending={isLinesLoading || isOriginStocksLoading}
            hasError={
              Boolean(resultsQuery.isError) ||
              isLinesError ||
              isOriginStocksError
            }
            selectedResultId={selectedResultId}
            onSelect={setSelectedResultId}
          />
          {selectedResultId ? (
            <div className="flex flex-col gap-y-4">
              <RefiningRefinerSelect options={refinerOptions} />
              <RefiningProvenanceFields
                onProvenanceChange={(provenance, checked) =>
                  setSelectedProvenances((current) =>
                    checked
                      ? [
                          ...current.filter((value) => value !== provenance),
                          provenance,
                        ]
                      : current.filter((value) => value !== provenance),
                  )
                }
              />
              <RefiningQuantityField
                selectedResultId={selectedResultId}
                linesPending={isLinesLoading || isOriginStocksLoading}
                ppcm={ppcm}
                maxClickCount={selectedOption?.maxClickCount ?? 0}
              />
            </div>
          ) : null}
        </div>

        <FormButtonsSection
          fullWidth
          className="!mt-auto !mx-0"
          onCancel={onClose}
          submitDisabled={
            refineMutation.isPending ||
            !selectedOption?.refinable ||
            !refinerOptions.length
          }
          cancelDisabled={refineMutation.isPending}
          submitLabel={refineMutation.isPending ? "Refinage..." : "Refiner"}
        />
      </GenericForm>
    </ModalGeneric>
  );
}

export default RefiningModal;
