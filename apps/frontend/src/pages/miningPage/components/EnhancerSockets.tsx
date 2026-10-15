import { useEffect, useState } from "react";
import AppSelect from "@/shared/components/form/Select/AppSelect";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { getItemImageUrl } from "@/shared/helpers";
import type { MiningAvailableStackResponse } from "@/api/generated/react-query/model/miningAvailableStackResponse";
import type { ItemViewModel } from "@zod-schemas";
import MiningItemOption from "./MiningItemOption";
import styles from "./MiningSessionModal.module.css";

export type SelectedEnhancer = { socket: number; itemId: string; quantity: number };

const NO_ENHANCER = "__none__";

function EnhancerSockets({
  tierLevel,
  enhancersBySocket,
  itemById,
  target,
  title,
  onSelectionChange,
}: {
  tierLevel?: number | null;
  enhancersBySocket: Record<string, MiningAvailableStackResponse[]>;
  itemById: Map<string, ItemViewModel>;
  target: "FINDER" | "EXCAVATOR";
  title: string;
  onSelectionChange?: (enhancers: SelectedEnhancer[]) => void;
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
  const enhancerOptions = enhancers.map((enhancer) => ({
    value: enhancer.itemId,
    label: (
      <MiningItemOption
        item={itemById.get(enhancer.itemId)}
        quantity={enhancer.quantity}
      />
    ),
  }));
  const options = [
    { value: NO_ENHANCER, label: <span className="flex h-[38px] items-center">Aucun enhancer</span> },
    ...enhancerOptions,
  ];

  const selectEnhancer = (socket: number, itemId: string) => {
    const available = enhancers.find((enhancer) => enhancer.itemId === itemId);
    if (!available) return;

    setSelectedEnhancers((current) => ({
      ...current,
      [socket]: { socket, itemId, quantity: available.quantity },
    }));
    setLastSelectedSocket(socket);
    setActiveSocket(undefined);
  };

  const displayedSocket = activeSocket ?? lastSelectedSocket;

  useEffect(() => {
    onSelectionChange?.(
      Object.values(selectedEnhancers),
    );
  }, [onSelectionChange, selectedEnhancers]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-text">{title}</div>
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
              {selected && <span className={styles.socketQuantity}>×{selected.quantity}</span>}
            </div>
          );
        })}
      </div>
      {displayedSocket && (
        <div className="flex items-center gap-2">
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
              if (!activeSocket) return;
              if (itemId === NO_ENHANCER) {
                setSelectedEnhancers((current) => {
                  const next = { ...current };
                  delete next[activeSocket];
                  return next;
                });
                return;
              }
              selectEnhancer(activeSocket, itemId);
            }}
            disabled={!activeSocket || !enhancerOptions.length}
            triggerClassName="h-14"
          />
        </div>
      )}
    </div>
  );
}

export default EnhancerSockets;
