import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch } from "@/api/generated/react-query/entropiaManagerAPI";
import type { MiningClaimResponse } from "@/api/generated/react-query/model/miningClaimResponse";
import type { MiningDepositSizeResponse } from "@/api/generated/react-query/model/miningDepositSizeResponse";
import { GenericForm } from "@/shared/components/form/Genericform";
import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import SelectRHF from "@/shared/components/form/Select/SelectRHF";
import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import { ModalGeneric } from "@/shared/components";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { ItemViewModel } from "@zod-schemas";

const nullableNumber = (integer = false) =>
  z.preprocess(
    (value) => value === "" || (typeof value === "number" && Number.isNaN(value)) ? null : value,
    (integer ? z.number().int() : z.number()).nullable(),
  );

const claimEditSchema = z.object({
  itemId: z.string().nullable(),
  depositSize: z.string().nullable(),
  quantity: nullableNumber(true),
  value: nullableNumber(),
  latitude: nullableNumber(true),
  longitude: nullableNumber(true),
  depleted: z.boolean(),
});

type ClaimEditValues = z.output<typeof claimEditSchema>;

type MiningClaimEditModalProps = {
  sessionId: string;
  claims: MiningClaimResponse[];
  items: ItemViewModel[];
  depositSizes: MiningDepositSizeResponse[];
};

function MiningClaimEditModal({
  sessionId,
  claims,
  items,
  depositSizes,
}: MiningClaimEditModalProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const claimId = searchParams.get("claimId");
  const claim = claims.find((entry) => entry.id === claimId);
  const patchClaim = usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch();

  const itemOptions = useMemo(
    () => items.map((item) => ({ value: item.id, label: item.name })),
    [items],
  );
  const sizeOptions = useMemo(
    () => depositSizes.map((size) => ({
      value: String(size.id),
      label: `${size.romanSize} — ${size.sizeLabel}`,
    })),
    [depositSizes],
  );

  const close = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("claimId");
    setSearchParams(next);
  };

  if (!claimId || !claim) return null;

  const selectedDepositSize = depositSizes.find((size) => size.size === claim.depositSize);

  const defaultValues = {
    itemId: claim.itemId,
    depositSize: selectedDepositSize ? String(selectedDepositSize.id) : null,
    quantity: claim.quantity,
    value: claim.value === null ? null : Number(claim.value),
    latitude: claim.latitude,
    longitude: claim.longitude,
    depleted: claim.depositSize !== null,
  };

  const handleSubmit = async (values: ClaimEditValues) => {
    if (!claim.id.startsWith("__fake-claim-")) {
      await patchClaim.mutateAsync({
        sessionId,
        claimId: claim.id,
        data: {
          itemId: values.itemId || null,
          quantity: values.quantity,
          value: values.value,
          latitude: values.latitude,
          longitude: values.longitude,
          depositSize: values.depleted && values.depositSize
            ? depositSizes.find((size) => String(size.id) === values.depositSize)?.size ?? null
            : null,
        },
      });
      await InvalidateQueryAndKeys.miningMutation(sessionId);
    }
    close();
  };

  return (
    <ModalGeneric
      dialogType="form"
      open={true}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title={{ value: "Modifier le claim" }}
      contentStyle="max-h-[90vh] overflow-y-auto"
    >
      <GenericForm
        key={claim.id}
        schema={claimEditSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <SelectRHF name="itemId" label="Ressource: " options={itemOptions} placeholder="Choisir une ressource..." />
        <SelectRHF name="depositSize" label="Taille: " options={sizeOptions} placeholder="Choisir une taille..." />
        <InputRHF name="quantity" label="Quantité: " type="number" min={1} step="1" registerOptions={{ valueAsNumber: true }} />
        <InputRHF name="value" label="Valeur: " type="number" min={0} step="any" registerOptions={{ valueAsNumber: true }} />
        <div className="grid grid-cols-2 gap-2">
          <InputRHF name="latitude" label="Latitude: " type="number" step="1" registerOptions={{ valueAsNumber: true }} />
          <InputRHF name="longitude" label="Longitude: " type="number" step="1" registerOptions={{ valueAsNumber: true }} />
        </div>
        <CheckboxRHF name="depleted" label="Depleted" />
        <FormButtonsSection
          submitDisabled={patchClaim.isPending}
          cancelDisabled={patchClaim.isPending}
          submitLabel="Enregistrer"
          onCancel={close}
        />
      </GenericForm>
    </ModalGeneric>
  );
}

export default MiningClaimEditModal;
