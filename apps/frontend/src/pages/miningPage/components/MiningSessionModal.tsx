import { useNavigate } from "react-router-dom";
import { useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { Button } from "@/components/ui/button";
import { ModalGeneric } from "@/shared/components";

function MiningSessionModal() {
  const navigate = useNavigate();
  const availableQuery =
    useGetAvailableMiningInventoryApiV2SessionsMiningAvailableGet();

  const onClose = () => navigate("/mining");
  const available = availableQuery.data;

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
          <div className="grid gap-3 sm:grid-cols-2">
            <InventoryGroup label="Finders" count={available.finder.length} />
            <InventoryGroup
              label="Amplificateurs"
              count={available.finderAmplifier.length}
            />
            <InventoryGroup label="Excavateurs" count={available.excavator.length} />
            <InventoryGroup label="Munitions" count={available.ammo.length} />
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
