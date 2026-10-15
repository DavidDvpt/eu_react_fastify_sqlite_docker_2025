import { useState } from "react";
import AppSelect from "@/shared/components/form/Select/AppSelect";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import { getItemImageUrl } from "@/shared/helpers";
import type { MiningAvailableStackResponse } from "@/api/generated/react-query/model/miningAvailableStackResponse";
import type { ItemViewModel } from "@zod-schemas";
import MiningItemOption from "./MiningItemOption";
import styles from "./MiningSessionModal.module.css";

type SelectedEnhancer = { itemId: string; quantity: number };

function EnhancerSockets({
  tierLevel,
  enhancersBySocket,
  itemById,
  target,
  title,
}: {
  tierLevel?: number | null;
  enhancersBySocket: Record<string, MiningAvailableStackResponse[]>;
  itemById: Map<string, ItemViewModel>;
  target: "FINDER" | "EXCAVATOR";
  title: string;
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
  const options = enhancers.map((enhancer) => ({
    value: enhancer.itemId,
    label: (
      <MiningItemOption
        item={itemById.get(enhancer.itemId)}
        quantity={enhancer.quantity}
      />
    ),
  }));

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

export default EnhancerSockets;
