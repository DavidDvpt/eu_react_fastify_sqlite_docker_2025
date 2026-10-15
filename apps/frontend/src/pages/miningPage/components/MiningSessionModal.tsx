import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { Button } from "@/components/ui/button";
import AppSelect from "@/shared/components/form/Select/AppSelect";
import { ModalGeneric } from "@/shared/components";
import { useSystemDatas } from "@/shared/hooks";
import { formatItemNameWithTier, getItemImageUrl } from "@/shared/helpers";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import type { MiningAvailableLotResponse } from "@/api/generated/react-query/model/miningAvailableLotResponse";
import type { MiningAvailableStackResponse } from "@/api/generated/react-query/model/miningAvailableStackResponse";
import type { ItemViewModel } from "@zod-schemas";
import styles from "./MiningSessionModal.module.css";

function MiningSessionModal() {
  const navigate = useNavigate();
  const availableQuery =
    useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet();
  const {
    items: { itemDatas, isLoading: isItemsLoading },
  } = useSystemDatas();
  const [finderLotId, setFinderLotId] = useState<string>();
  const [excavatorLotId, setExcavatorLotId] = useState<string>();

  const onClose = () => navigate("/mining");
  const available = availableQuery.data;
  const itemById = useMemo(
    () => new Map((itemDatas ?? []).map((item) => [item.id, item])),
    [itemDatas],
  );

  const finderLots = available?.finder ?? [];
  const excavatorLots = available?.excavator ?? [];

  return (
    <ModalGeneric
      dialogType="form"
      title={{ value: "Session Mining" }}
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      contentStyle="w-[min(720px,calc(100vw-2rem))] max-w-none"
    >
      <div className="flex flex-col gap-4 overflow-y-auto">
        <p className="text-sm text-text-muted">
          Sélectionnez votre équipement et vos consommables pour initialiser une
          session de mining.
        </p>

        {availableQuery.isPending && (
          <div className="rounded-md border border-border p-4 text-sm text-text-muted">
            Chargement de l’inventaire disponible...
          </div>
        )}

        {availableQuery.isError && (
          <div className="rounded-md border border-error-500 p-4 text-sm text-error-300">
            Impossible de charger l’inventaire disponible.
          </div>
        )}

        {available && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <MiningEquipmentSelect
                label="Finder"
                placeholder="Sélectionner un finder"
                lots={finderLots}
                itemById={itemById}
                value={finderLotId}
                onValueChange={setFinderLotId}
                disabled={isItemsLoading}
                enhancersBySocket={available.finderEnhancers}
                target="FINDER"
              />
              <MiningEquipmentSelect
                label="Excavateur"
                placeholder="Sélectionner un excavateur"
                lots={excavatorLots}
                itemById={itemById}
                value={excavatorLotId}
                onValueChange={setExcavatorLotId}
                disabled={isItemsLoading}
                enhancersBySocket={available.excavatorEnhancers}
                target="EXCAVATOR"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InventoryGroup label="Amplificateurs" count={available.finderAmplifier.length} />
              <InventoryGroup label="Enhancers" count={Object.values(available.finderEnhancers).flat().length} />
              <InventoryGroup label="Munitions" count={available.ammo.length} />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" disabled>
            Créer la session
          </Button>
        </div>
      </div>
    </ModalGeneric>
  );
}

type MiningEquipmentSelectProps = {
  label: string;
  placeholder: string;
  lots: MiningAvailableLotResponse[];
  itemById: Map<string, ItemViewModel>;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  enhancersBySocket: Record<string, MiningAvailableStackResponse[]>;
  target: "FINDER" | "EXCAVATOR";
};

function MiningEquipmentSelect({
  label,
  placeholder,
  lots,
  itemById,
  value,
  onValueChange,
  disabled = false,
  enhancersBySocket,
  target,
}: MiningEquipmentSelectProps) {
  const options = lots
    .filter((lot) => lot.lotId)
    .map((lot) => {
      const item = itemById.get(lot.itemId);
      return {
        value: lot.lotId as string,
        label: (
          <MiningItemOption
            item={item}
            tierLevel={lot.tierLevel}
            quantity={lot.quantity}
          />
        ),
      };
    });
  const selectedLot = lots.find((lot) => lot.lotId === value);
  const selectedItem = selectedLot ? itemById.get(selectedLot.itemId) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text">{label}</label>
      <AppSelect
        value={value}
        onValueChange={onValueChange}
        options={options}
        placeholder={options.length ? placeholder : `Aucun ${label.toLowerCase()} disponible`}
        disabled={disabled || !options.length}
        triggerClassName="bg-input"
      />
      {selectedItem && selectedLot && (
        <EnhancerSockets
          key={selectedLot.lotId}
          tierLevel={selectedLot.tierLevel}
          enhancersBySocket={enhancersBySocket}
          itemById={itemById}
          target={target}
        />
      )}
    </div>
  );
}

type SelectedEnhancer = {
  itemId: string;
  quantity: number;
};

function EnhancerSockets({
  tierLevel,
  enhancersBySocket,
  itemById,
  target,
}: {
  tierLevel?: number | null;
  enhancersBySocket: Record<string, MiningAvailableStackResponse[]>;
  itemById: Map<string, ItemViewModel>;
  target: "FINDER" | "EXCAVATOR";
}) {
  const [activeSocket, setActiveSocket] = useState<number>();
  const [lastSelectedSocket, setLastSelectedSocket] = useState<number>();
  const [selectedEnhancers, setSelectedEnhancers] = useState<
    Record<number, SelectedEnhancer>
  >({});
  const enabledSockets = Math.min(Math.max(tierLevel ?? 0, 0), 10);
  const enhancers = activeSocket
    ? enhancersBySocket[String(activeSocket)] ?? []
    : [];
  const options = enhancers.map((enhancer) => {
    const enhancerItem = itemById.get(enhancer.itemId);
    return {
      value: enhancer.itemId,
      label: (
        <MiningItemOption
          item={enhancerItem}
          quantity={enhancer.quantity}
        />
      ),
    };
  });

  const selectEnhancer = (socket: number, itemId: string) => {
    const available = enhancers.find((enhancer) => enhancer.itemId === itemId);
    if (!available) return;

    setSelectedEnhancers((current) => ({
      ...current,
      [socket]: { itemId, quantity: available.quantity },
    }));
    setLastSelectedSocket(socket);
    setActiveSocket(undefined);
  };

  const displayedSocket = activeSocket ?? lastSelectedSocket;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
      <div className="text-sm font-medium text-text">Enhancers</div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, index) => index + 1).map((socket) => {
          const isEnabled = socket <= enabledSockets;
          const selected = selectedEnhancers[socket];
          const selectedItem = selected ? itemById.get(selected.itemId) : undefined;

          return (
            <div key={socket} className={styles.socketSlot}>
              <button
                type="button"
                disabled={!isEnabled}
                onClick={() => setActiveSocket(socket)}
                className={`${styles.socketButton} ${activeSocket === socket ? styles.socketActive : ""}`}
                aria-label={`Socket ${socket}${selectedItem ? `, ${selectedItem.name}` : ""}`}
              >
                {selectedItem ? (
                  <ItemImage
                    url={getItemImageUrl(selectedItem.imageUrlId, "normal")}
                    alt={selectedItem.name}
                    size="small"
                    classname={styles.socketIcon}
                  />
                ) : (
                  socket
                )}
              </button>
              {selected && (
                <span className={styles.socketQuantity}>×{selected.quantity}</span>
              )}
            </div>
          );
        })}
      </div>
      {displayedSocket && (
        <AppSelect
          key={`mining-enhancer-select-${displayedSocket}-${activeSocket ? "active" : "disabled"}`}
          options={options}
          placeholder={
            options.length
              ? `Enhancer pour le socket ${displayedSocket}`
              : `Aucun enhancer disponible pour ce ${target.toLowerCase()}`
          }
          value={selectedEnhancers[displayedSocket]?.itemId}
          onValueChange={(itemId) => {
            if (activeSocket) selectEnhancer(activeSocket, itemId);
          }}
          disabled={!activeSocket || !options.length}
        />
      )}
    </div>
  );
}

function MiningItemOption({
  item,
  tierLevel,
  quantity,
}: {
  item?: ItemViewModel;
  tierLevel?: number | null;
  quantity: number;
}) {
  const name = item
    ? formatItemNameWithTier({
        name: item.name,
        hasTierOption: item.type?.hasTierOption,
        isStackable: item.type?.isStackable,
        tierLevel,
      })
    : "Item indisponible";

  return (
    <span className="flex items-center gap-2">
      <ItemImage
        url={item ? getItemImageUrl(item.imageUrlId, "normal") : null}
        alt={name}
        size="small"
        classname="shrink-0"
      />
      <span className="min-w-0 truncate">{name}</span>
      <span className="ml-auto shrink-0 text-xs text-text-muted">×{quantity}</span>
    </span>
  );
}

function InventoryGroup({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-md border border-border bg-bg/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-text">{label}</span>
        <span className="text-sm text-text-muted">{count} disponible(s)</span>
      </div>
    </div>
  );
}

export default MiningSessionModal;
