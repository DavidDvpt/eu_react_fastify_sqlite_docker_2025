import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet } from "@/api/generated/react-query/entropiaManagerAPI";
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
      <span>{label} : <span className="text-text">{item?.name ?? "—"}</span>{children && ` — ${children}`}</span>
    </div>
  );
}

function MiningSessionModal() {
  const navigate = useNavigate();
  const availableQuery = useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet();
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
  const formatPed = (value: number) => `${value.toFixed(3)} PED`;
  const selectedAmmoItem = ammoSelection ? itemById.get(ammoSelection.itemId) : undefined;
  const ammoCost = clickCount && searchType ? clickCount * 0.5 * searchType : 0;
  const ammoRequiredQuantity = selectedAmmoItem?.value
    ? Math.ceil(ammoCost / selectedAmmoItem.value)
    : 0;
  const finderCost = clickCount && finderDecay ? clickCount * finderDecay : 0;
  const selectedAmplifierItem = amplifierSelection
    ? itemById.get(amplifierSelection.itemId)
    : undefined;
  const amplifierClicks = amplifierSelection?.allocations.reduce(
    (total, allocation) => total + allocation.clicks,
    0,
  ) ?? 0;
  const amplifierCost = selectedAmplifierItem?.decay && searchType
    ? selectedAmplifierItem.decay * amplifierClicks * searchType
    : 0;
  const onClose = () => navigate("/mining");

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
              <SummaryItem item={selectedAmmoItem} label="Munitions">
                {ammoRequiredQuantity} requis — {formatPed(ammoCost)}
              </SummaryItem>
              <SummaryItem item={selectedFinderItem} label="Finder">
                decay {formatPed(finderCost)}
              </SummaryItem>
              {finderEnhancers.map((enhancer) => (
                <SummaryItem key={`finder-enhancer-${enhancer.socket}`} item={itemById.get(enhancer.itemId)} label={`Enhancer finder · socket ${enhancer.socket}`} indent />
              ))}
              {selectedAmplifierItem && (
                <SummaryItem item={selectedAmplifierItem} label="Amplificateur">
                  {amplifierSelection?.allocations.find((allocation) => allocation.isFullTT)?.quantity ?? 0} full TT — decay {formatPed(amplifierCost)}
                </SummaryItem>
              )}
              <SummaryItem item={selectedExcavatorItem} label="Excavateur" />
              {excavatorEnhancers.map((enhancer) => (
                <SummaryItem key={`excavator-enhancer-${enhancer.socket}`} item={itemById.get(enhancer.itemId)} label={`Enhancer excavateur · socket ${enhancer.socket}`} indent />
              ))}
            </div>
          </section>
        )}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="secondary" className="w-[calc(120px+3rem)]" onClick={onClose}>Annuler</Button>
          {!showSummary ? (
            <Button variant="primary" className="w-[calc(120px+3rem)]" disabled={!formReady} onClick={() => setShowSummary(true)}>Valider</Button>
          ) : (
            <Button variant="primary" className="w-[calc(120px+3rem)]">Valider</Button>
          )}
        </div>
      </div>
    </ModalGeneric>
  );
}

export default MiningSessionModal;
