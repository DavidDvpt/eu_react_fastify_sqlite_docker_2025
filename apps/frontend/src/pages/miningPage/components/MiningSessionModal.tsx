import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet } from "@/api/generated/react-query/entropiaManagerAPI";
import {
  useCreateMiningSessionApiV2SessionsMiningPost,
  getGetMiningSessionsApiV2SessionsMiningGetQueryKey,
  usePrevalidateMiningSessionApiV2SessionsMiningPrevalidatePost,
} from "@/api/generated/react-query/entropiaManagerAPI";
import type { MiningPrevalidationResponse } from "@/api/generated/react-query/model/miningPrevalidationResponse";
import { Button } from "@/components/ui/button";
import { ModalGeneric } from "@/shared/components";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { getItemImageUrl } from "@/shared/helpers";
import { useSystemDatas } from "@/shared/hooks";
import FinderAmplifierSelector from "./FinderAmplifierSelector";
import type { AmplifierSelection } from "./FinderAmplifierSelector";
import type { SelectedEnhancer } from "./EnhancerSockets";
import MiningAmmoSelector from "./MiningAmmoSelector";
import MiningEquipmentSelect from "./MiningEquipmentSelect";

function SummaryItem({
  item,
  label,
  children,
  indent = false,
}: {
  item?: { name: string; imageUrlId: string };
  label: string;
  children?: ReactNode;
  indent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${indent ? "pl-4" : ""}`}>
      {item && (
        <ItemImage
          url={getItemImageUrl(item.imageUrlId, "normal")}
          alt={item.name}
          size="small"
          classname="shrink-0"
        />
      )}
      <span>{label} : <span className="text-text">{item?.name ?? "—"}</span></span>
      {children && <span className="ml-auto text-right text-text">{children}</span>}
    </div>
  );
}

function SummaryCostItem({
  item,
  label,
  costTt,
  costTtc,
}: {
  item?: { name: string; imageUrlId: string };
  label: string;
  costTt: number;
  costTtc: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {item && (
        <ItemImage
          url={getItemImageUrl(item.imageUrlId, "normal")}
          alt={item.name}
          size="small"
          classname="shrink-0"
        />
      )}
      <span>{label} : <span className="text-text">{item?.name ?? "—"}</span></span>
      <span className="ml-auto grid grid-cols-2 gap-4 text-right text-text">
        <span>{new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(costTt)} PED</span>
        <span>{new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(costTtc)} PED</span>
      </span>
    </div>
  );
}

function MiningSessionModal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const availableQuery = useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet();
  const prevalidateMutation = usePrevalidateMiningSessionApiV2SessionsMiningPrevalidatePost();
  const createSessionMutation = useCreateMiningSessionApiV2SessionsMiningPost();
  const {
    items: { itemDatas, isLoading: isItemsLoading },
  } = useSystemDatas();
  const [finderLotId, setFinderLotId] = useState<string>();
  const [excavatorLotId, setExcavatorLotId] = useState<string>();
  const [clickCount, setClickCount] = useState<number | undefined>(undefined);
  const [isEnmatterSelected, setIsEnmatterSelected] = useState(false);
  const [isOresSelected, setIsOresSelected] = useState(false);
  const [ammoSelection, setAmmoSelection] = useState<{ itemId: string; quantity: number }>();
  const [finderEnhancers, setFinderEnhancers] = useState<SelectedEnhancer[]>([]);
  const [excavatorEnhancers, setExcavatorEnhancers] = useState<SelectedEnhancer[]>([]);
  const [amplifierSelection, setAmplifierSelection] = useState<AmplifierSelection>();
  const [showSummary, setShowSummary] = useState(false);
  const [prevalidation, setPrevalidation] = useState<MiningPrevalidationResponse>();
  const searchType = isEnmatterSelected && isOresSelected ? 3 : isEnmatterSelected ? 1 : isOresSelected ? 2 : undefined;
  const available = availableQuery.data;
  const itemById = useMemo(
    () => new Map((itemDatas ?? []).map((item) => [item.id, item])),
    [itemDatas],
  );
  const selectedFinder = available?.finder.find((lot) => lot.lotId === finderLotId);
  const selectedFinderItem = selectedFinder
    ? itemById.get(selectedFinder.itemId)
    : undefined;
  const selectedExcavator = available?.excavator.find((lot) => lot.lotId === excavatorLotId);
  const selectedExcavatorItem = selectedExcavator
    ? itemById.get(selectedExcavator.itemId)
    : undefined;
  const finderDecay = selectedFinderItem?.decay
    ? selectedFinderItem.decay * (searchType === 3 ? 2 : 1)
    : undefined;
  const equipmentReady = Boolean(clickCount && clickCount > 0 && searchType);
  const formReady = Boolean(
    clickCount &&
      clickCount > 0 &&
      searchType &&
      selectedFinder &&
      excavatorLotId &&
      ammoSelection &&
      finderDecay &&
      (selectedFinder.ttRemaining ?? 0) > finderDecay * clickCount,
  );
  const onAmmoSelectionChange = useCallback((selection?: { itemId: string; quantity: number }) => {
    setAmmoSelection(selection);
  }, []);
  const onFinderEnhancersChange = useCallback((enhancers: SelectedEnhancer[]) => {
    setFinderEnhancers(enhancers);
  }, []);
  const onExcavatorEnhancersChange = useCallback((enhancers: SelectedEnhancer[]) => {
    setExcavatorEnhancers(enhancers);
  }, []);
  const onAmplifierSelectionChange = useCallback((selection?: AmplifierSelection) => {
    setAmplifierSelection(selection);
  }, []);
  const formatAmount = (value: number) => new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 3,
  }).format(value);
  const formatPercent = (value: number) => new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  const formatPed = (value: number) => `${formatAmount(value)} PED`;
  const selectedAmmoItem = ammoSelection ? itemById.get(ammoSelection.itemId) : undefined;
  const ammoCost = clickCount && searchType ? clickCount * 0.5 * searchType : 0;
  const ammoQuantity = selectedAmmoItem?.value
    ? Math.ceil(ammoCost / selectedAmmoItem.value)
    : 0;
  const totalTtc = prevalidation
    ? prevalidation.total.costTtc
    : 0;
  const onClose = () => navigate("/mining");
  const onPrevalidate = async () => {
    if (!available || !clickCount || !searchType || !finderLotId || !ammoSelection) return;

    const result = await prevalidateMutation.mutateAsync({
      data: {
        clicks: clickCount,
        type: searchType,
        ammoItemId: ammoSelection.itemId,
        ammoQuantity,
        finderLotIds: [finderLotId],
        ampLotIds: amplifierSelection?.lotIds,
      },
    });
    setPrevalidation(result);
    setShowSummary(true);
  };
  const onCreateSession = async () => {
    if (!clickCount || !searchType || !finderLotId || !excavatorLotId || !ammoSelection) return;

    await createSessionMutation.mutateAsync({
      data: {
        clickCount,
        searchType,
        finderLotId,
        ammoItemId: ammoSelection.itemId,
        ammoQuantityInitial: ammoQuantity,
        amplifierLotIds: amplifierSelection?.lotIds,
        excavatorLotIds: [excavatorLotId],
        enhancers: [
          ...finderEnhancers.map((enhancer) => ({
            itemId: enhancer.itemId,
            target: "FINDER" as const,
            targetLotId: finderLotId,
            socket: enhancer.socket,
            quantityInitial: enhancer.quantity,
          })),
          ...excavatorEnhancers.map((enhancer) => ({
            itemId: enhancer.itemId,
            target: "EXCAVATOR" as const,
            targetLotId: excavatorLotId,
            socket: enhancer.socket,
            quantityInitial: enhancer.quantity,
          })),
        ],
      },
    });
    await queryClient.invalidateQueries({
      queryKey: getGetMiningSessionsApiV2SessionsMiningGetQueryKey(),
    });
    onClose();
  };

  return (
    <ModalGeneric
      dialogType="form"
      title={{ value: "Session Mining" }}
      open={true}
      onOpenChange={(open) => { if (!open) onClose(); }}
      contentStyle="w-[min(720px,calc(100vw-2rem))] max-w-none"
    >
      <div className="flex flex-col gap-4 overflow-y-auto">
        {!showSummary && <p className="text-sm text-text-muted">Sélectionnez votre équipement et vos consommables pour initialiser une session de mining.</p>}
        {availableQuery.isPending && <div className="rounded-md border border-border p-4 text-sm text-text-muted">Chargement de l’inventaire disponible...</div>}
        {availableQuery.isError && <div className="rounded-md border border-error-500 p-4 text-sm text-error-300">Impossible de charger l’inventaire disponible.</div>}
        {available && !showSummary && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="mining-click-count" className="text-sm font-medium text-text">Nombre de clics</label>
                <input id="mining-click-count" type="number" min={1} max={9999} value={clickCount ?? ""} onChange={(event) => { const value = event.currentTarget.value; setClickCount(value === "" ? undefined : Math.min(9999, Math.max(0, Number(value)))); }} className="ml-1 h-9 w-24 rounded-md border border-border bg-input px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">Type</span>
                <div className="flex gap-2">
                  <Button type="button" variant={isEnmatterSelected ? "primary" : "secondary"} className="w-[calc(70px+3rem)]" aria-pressed={isEnmatterSelected} onClick={() => setIsEnmatterSelected((selected) => !selected)}>Enmatter</Button>
                  <Button type="button" variant={isOresSelected ? "primary" : "secondary"} className="w-[calc(70px+3rem)]" aria-pressed={isOresSelected} onClick={() => setIsOresSelected((selected) => !selected)}>Ores</Button>
                </div>
                <span className="sr-only">Type Mining : {searchType ?? "non sélectionné"}</span>
              </div>
            </div>
            <MiningAmmoSelector
              ammo={available.ammo}
              itemById={itemById}
              clickCount={clickCount ?? 0}
              searchType={searchType}
              disabled={isItemsLoading || !equipmentReady}
              onSelectionChange={onAmmoSelectionChange}
            />
            <section className="flex flex-col gap-4 rounded-md border border-border p-4">
              <h3 className="m-0 mb-[10px] text-base font-medium text-text">Session Finder</h3>
              <MiningEquipmentSelect label="Finder" placeholder="Sélectionner un finder" lots={available.finder} itemById={itemById} value={finderLotId} onValueChange={setFinderLotId} disabled={isItemsLoading || !equipmentReady} enhancersBySocket={available.finderEnhancers} target="FINDER" title="Enhancers" clickCount={clickCount ?? 0} searchType={searchType} onEnhancersChange={onFinderEnhancersChange} />
              <FinderAmplifierSelector
                lots={available.finderAmplifier}
                itemById={itemById}
                clickCount={clickCount ?? 0}
                searchType={searchType}
                disabled={isItemsLoading || !equipmentReady}
                onSelectionChange={onAmplifierSelectionChange}
              />
            </section>
            <section className="flex flex-col gap-4 rounded-md border border-border p-4">
              <h3 className="m-0 mb-[10px] text-base font-medium text-text">Session Excavator</h3>
              <MiningEquipmentSelect label="Excavateur" placeholder="Sélectionner un excavateur" lots={available.excavator} itemById={itemById} value={excavatorLotId} onValueChange={setExcavatorLotId} disabled={isItemsLoading || !equipmentReady} enhancersBySocket={available.excavatorEnhancers} target="EXCAVATOR" title="Enhancers" clickCount={clickCount ?? 0} searchType={searchType} onEnhancersChange={onExcavatorEnhancersChange} />
            </section>
          </div>
        )}
        {showSummary && (
          <section className="flex flex-col gap-3 rounded-md border border-border p-4">
            <h3 className="m-0 text-base font-medium text-text">Récapitulatif</h3>
              <div className="grid gap-2 text-sm text-text-muted">
              <div>Nombre de clics : <span className="text-text">{clickCount}</span></div>
              <div>Types sélectionnés : <span className="text-text">{[isEnmatterSelected && "Enmatter", isOresSelected && "Ores"].filter(Boolean).join(" + ")}</span></div>
              {prevalidation?.ammo.map((line) => (
                <SummaryCostItem key={`ammo-${line.itemId}`} item={itemById.get(line.itemId)} label="Munitions" costTt={line.costTt} costTtc={line.costTtc} />
              ))}
              {prevalidation?.finder.map((line) => (
                <SummaryCostItem key={`finder-${line.lotId}`} item={itemById.get(line.itemId)} label="Finder" costTt={line.costTt} costTtc={line.costTtc} />
              ))}
              {finderEnhancers.map((enhancer) => (
                <SummaryItem key={`finder-enhancer-${enhancer.socket}`} item={itemById.get(enhancer.itemId)} label={`Enhancer finder · socket ${enhancer.socket}`} indent />
              ))}
              {prevalidation?.amp.map((line) => (
                <SummaryCostItem key={line.lotId} item={itemById.get(line.itemId)} label="Amplificateur" costTt={line.costTt} costTtc={line.costTtc} />
              ))}
              <SummaryItem item={selectedExcavatorItem} label="Excavateur" />
              {excavatorEnhancers.map((enhancer) => (
                <SummaryItem key={`excavator-enhancer-${enhancer.socket}`} item={itemById.get(enhancer.itemId)} label={`Enhancer excavateur · socket ${enhancer.socket}`} indent />
              ))}
            </div>
            {prevalidateMutation.isError && <div className="text-sm text-error-300">Impossible de prévalider cette session.</div>}
            {createSessionMutation.isError && <div className="text-sm text-error-300">Impossible de créer cette session.</div>}
            {prevalidation && (
              <table className="w-full border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="px-2 py-2 text-left font-medium">Clics</th>
                    <th className="px-2 py-2 font-medium">TT</th>
                    <th className="px-2 py-2 font-medium">TTC</th>
                    <th className="px-2 py-2 font-medium">Clic TT</th>
                    <th className="px-2 py-2 font-medium">Clic TTC</th>
                    <th className="px-2 py-2 font-medium">%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-text">
                    <td className="px-2 py-2 text-left">{clickCount}</td>
                    <td className="px-2 py-2">{formatPed(prevalidation.total.costTt)}</td>
                    <td className="px-2 py-2">{formatPed(totalTtc)}</td>
                    <td className="px-2 py-2">{formatPed(prevalidation.total.costTt / (clickCount ?? 1))}</td>
                    <td className="px-2 py-2">{formatPed(totalTtc / (clickCount ?? 1))}</td>
                    <td className="px-2 py-2">{formatPercent((totalTtc / prevalidation.total.costTt) * 100)}%</td>
                  </tr>
                </tbody>
              </table>
            )}
          </section>
        )}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button
            variant="secondary"
            className="w-[calc(120px+3rem)]"
            onClick={showSummary ? () => setShowSummary(false) : onClose}
          >
            {showSummary ? "Retour" : "Annuler"}
          </Button>
          {!showSummary ? (
            <Button variant="primary" className="w-[calc(120px+3rem)]" disabled={!formReady || prevalidateMutation.isPending} onClick={onPrevalidate}>{prevalidateMutation.isPending ? "Validation..." : "Valider"}</Button>
          ) : (
            <Button
              variant="primary"
              className="w-[calc(120px+3rem)]"
              disabled={createSessionMutation.isPending}
              onClick={onCreateSession}
            >
              {createSessionMutation.isPending ? "Création..." : "Valider"}
            </Button>
          )}
        </div>
      </div>
    </ModalGeneric>
  );
}

export default MiningSessionModal;
