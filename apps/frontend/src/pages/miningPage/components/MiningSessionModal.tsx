import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { Button } from "@/components/ui/button";
import { ModalGeneric } from "@/shared/components";
import { useSystemDatas } from "@/shared/hooks";
import FinderAmplifierSelector from "./FinderAmplifierSelector";
import MiningEquipmentSelect from "./MiningEquipmentSelect";

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
  const searchType = isEnmatterSelected && isOresSelected ? 3 : isEnmatterSelected ? 1 : isOresSelected ? 2 : undefined;
  const available = availableQuery.data;
  const itemById = useMemo(
    () => new Map((itemDatas ?? []).map((item) => [item.id, item])),
    [itemDatas],
  );
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
        <p className="text-sm text-text-muted">Sélectionnez votre équipement et vos consommables pour initialiser une session de mining.</p>
        {availableQuery.isPending && <div className="rounded-md border border-border p-4 text-sm text-text-muted">Chargement de l’inventaire disponible...</div>}
        {availableQuery.isError && <div className="rounded-md border border-error-500 p-4 text-sm text-error-300">Impossible de charger l’inventaire disponible.</div>}
        {available && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="mining-click-count" className="text-sm font-medium text-text">Nombre de clics</label>
                <input id="mining-click-count" type="number" min={1} max={9999} value={clickCount ?? ""} onChange={(event) => { const value = event.currentTarget.value; setClickCount(value === "" ? undefined : Math.min(9999, Math.max(0, Number(value)))); }} className="h-9 w-24 rounded-md border border-border bg-input px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring" />
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
            <section className="flex flex-col gap-4 rounded-md border border-border p-4">
              <h3 className="m-0 mb-[10px] text-base font-medium text-text">Session Finder</h3>
              <MiningEquipmentSelect label="Finder" placeholder="Sélectionner un finder" lots={available.finder} itemById={itemById} value={finderLotId} onValueChange={setFinderLotId} disabled={isItemsLoading} enhancersBySocket={available.finderEnhancers} target="FINDER" title="Enhancers" />
              <FinderAmplifierSelector
                lots={available.finderAmplifier}
                itemById={itemById}
                clickCount={clickCount ?? 0}
                disabled={isItemsLoading}
              />
            </section>
            <section className="flex flex-col gap-4 rounded-md border border-border p-4">
              <h3 className="m-0 mb-[10px] text-base font-medium text-text">Session Excavator</h3>
              <MiningEquipmentSelect label="Excavateur" placeholder="Sélectionner un excavateur" lots={available.excavator} itemById={itemById} value={excavatorLotId} onValueChange={setExcavatorLotId} disabled={isItemsLoading} enhancersBySocket={available.excavatorEnhancers} target="EXCAVATOR" title="Enhancers" />
            </section>
          </div>
        )}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="secondary" className="w-[calc(120px+3rem)]" onClick={onClose}>Annuler</Button>
          <Button variant="primary" className="w-[calc(120px+3rem)]" disabled>Créer la session</Button>
        </div>
      </div>
    </ModalGeneric>
  );
}

export default MiningSessionModal;
