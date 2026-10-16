import { useUpdateInventoryLotApiV2InventoryLotsLotIdPatch } from "@/api/generated/react-query/entropiaManagerAPI";
import { LotUpdate, type LotUpdateOutput } from "@/api/generated/zod/model";
import { Button } from "@/components/ui/button";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import type { LotViewModel } from "@/shared/schemas";
import { Save } from "lucide-react";
import { useState } from "react";

function ItemTierEditor({
  itemId,
  lot,
  canEditTt,
  itemValue,
}: {
  itemId: string;
  lot: LotViewModel | null;
  canEditTt: boolean;
  itemValue: number;
}) {
  const updateLotMutation = useUpdateInventoryLotApiV2InventoryLotsLotIdPatch();
  const [externalError, setExternalError] = useState<
    { key: "tierLevel"; msg: string }[]
  >([]);

  const update = async (values: LotUpdateOutput) => {
    if (!lot) return;

    setExternalError([]);
    try {
      await updateLotMutation.mutateAsync({
        lotId: lot.id,
        data: canEditTt
          ? values
          : {
              tierLevel: values.tierLevel,
            },
      });
      await InvalidateQueryAndKeys.lotTierMutation(itemId);
    } catch {
      setExternalError([
        { key: "tierLevel", msg: "Impossible de modifier le tier." },
      ]);
    }
  };

  const currentTier = lot?.tierLevel ?? 0;
  const schema = LotUpdate.superRefine((values, context) => {
    if (
      lot &&
      values.tierLevel != null &&
      lot.tierLevel != null &&
      values.tierLevel < lot.tierLevel
    ) {
      context.addIssue({
        code: "custom",
        path: ["tierLevel"],
        message: "Le tier ne peut pas diminuer.",
      });
    }

    if (
      canEditTt &&
      typeof values.ttRemaining === "number" &&
      values.ttRemaining > itemValue
    ) {
      context.addIssue({
        code: "custom",
        path: ["ttRemaining"],
        message: `Le TT ne peut pas dépasser ${itemValue} PED.`,
      });
    }
  });

  return (
    <div className="flex flex-col gap-2 rounded-md border border-table-border p-2">
      {!lot ? (
        <p className="m-0 text-xs text-text-muted">Aucun lot à modifier.</p>
      ) : (
        <GenericForm
          key={lot.id}
          schema={schema}
          defaultValues={{
            tierLevel: currentTier,
            ttRemaining: lot.ttRemaining ?? itemValue,
          }}
          externalError={externalError}
          resetExternalError={() => setExternalError([])}
          onSubmit={update}
          className="flex items-center justify-between"
        >
          <div>
            <InputRHF
              name="tierLevel"
              label="Update tier"
              aria-label={`Nouveau tier du lot ${lot.id}`}
              type="number"
              min={currentTier}
              max={10}
              step={1}
              inputClassName="w-[80px]"
              registerOptions={{ valueAsNumber: true }}
            />
          </div>
          <div>
            {canEditTt ? (
              <InputRHF
                name="ttRemaining"
                label="Nouveau TT"
                aria-label={`Nouveau TT du lot ${lot.id}`}
                type="number"
                min={0}
                max={itemValue}
                step="any"
                inputClassName="w-[80px]"
                registerOptions={{ valueAsNumber: true }}
              />
            ) : null}
          </div>
          <div>
            <Button
              type="submit"
              variant="primary"
              size="icon"
              className="h-10 w-10 rounded-md p-0"
              aria-label={`Enregistrer le tier du lot ${lot.id}`}
              icon={Save}
              disabled={updateLotMutation.isPending}
            />
          </div>
        </GenericForm>
      )}
    </div>
  );
}
export default ItemTierEditor;
