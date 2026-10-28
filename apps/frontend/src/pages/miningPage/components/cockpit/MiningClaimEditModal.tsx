import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import {
  useCreateClaimApiV2MiningSessionIdClaimsPost,
  usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch,
} from '@/api/generated/react-query/entropiaManagerAPI';
import type { MiningClaimResponse } from '@/api/generated/react-query/model/miningClaimResponse';
import { GenericForm } from '@/shared/components/form/Genericform';
import FormButtonsSection from '@/shared/components/form/FormButtonsSection';
import InputRHF from '@/shared/components/form/Input/InputRHF';
import SelectRHF from '@/shared/components/form/Select/SelectRHF';
import CheckboxRHF from '@/shared/components/form/Checkbox/CheckboxRHF';
import { ModalGeneric } from '@/shared/components';
import { InvalidateQueryAndKeys } from '@/lib/react-query/InvalidateQueryAndKeys';
import type { ItemViewModel } from '@zod-schemas';
import { ObjectHelper } from '@/shared/helpers/ObjectHelper';

const nullableNumber = (integer = false) =>
  z.preprocess(
    (value) =>
      value === '' || (typeof value === 'number' && Number.isNaN(value))
        ? null
        : value,
    (integer ? z.number().int() : z.number()).nullable(),
  );

const claimEditSchema = z.object({
  itemId: z.string().nullable(),
  quantity: nullableNumber(true),
  latitude: nullableNumber(true),
  longitude: nullableNumber(true),
  depth: nullableNumber(),
  depleted: z.boolean(),
});

type ClaimEditValues = z.output<typeof claimEditSchema>;

type MiningClaimEditModalProps = {
  sessionId: string;
  claims: MiningClaimResponse[];
  items: ItemViewModel[];
  resourceNames: Record<string, string>;
};

function MiningClaimEditModal({
  sessionId,
  claims,
  items,
  resourceNames,
}: MiningClaimEditModalProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const claimId = searchParams.get('claimId');
  const isCreateMode = searchParams.get('createClaim') === 'true';
  const claim = claims.find((entry) => entry.id === claimId);
  const createClaim = useCreateClaimApiV2MiningSessionIdClaimsPost();
  const patchClaim = usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch();

  const itemOptions = useMemo(
    () => items.map((item) => ({ value: item.id, label: item.name })),
    [items],
  );
  const close = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('claimId');
    next.delete('createClaim');
    setSearchParams(next);
  };

  if ((!claimId || !claim) && !isCreateMode) return null;

  const resolvedItemId =
    claim?.item?.id ??
    items.find((item) => item.name === resourceNames[claim?.id ?? ''])?.id ??
    null;

  const defaultValues = {
    itemId: resolvedItemId,
    quantity: claim?.quantity ?? null,
    latitude: claim?.latitude ?? null,
    longitude: claim?.longitude ?? null,
    depth: claim?.depth == null ? null : Number(claim.depth),
    depleted: claim?.depleted === true,
  };

  const handleSubmit = async (values: ClaimEditValues) => {
    const depleted = values.depleted === true;
    if (isCreateMode) {
      const createdClaim = await createClaim.mutateAsync({
        sessionId,
        data: ObjectHelper.omitNullish({
          itemId: values.itemId || null,
          quantity: values.quantity,
          depth: values.depth,
          isGlobal: false,
          isHof: false,
        }),
      });
      if (
        values.latitude !== null ||
        values.longitude !== null ||
        values.depth !== null ||
        depleted
      ) {
        await patchClaim.mutateAsync({
          sessionId,
          claimId: createdClaim.id,
          data: ObjectHelper.omitNullish({
            itemId: values.itemId || null,
            quantity: values.quantity,
            latitude: values.latitude,
            longitude: values.longitude,
            depth: values.depth,
            depleted,
          }),
        });
      }
      await InvalidateQueryAndKeys.miningMutation(sessionId);
    } else if (claim && !claim.id.startsWith('__fake-claim-')) {
      await patchClaim.mutateAsync({
        sessionId,
        claimId: claim.id,
        data: ObjectHelper.omitNullish({
          itemId: values.itemId || null,
          quantity: values.quantity,
          latitude: values.latitude,
          longitude: values.longitude,
          depth: values.depth,
          depleted,
        }),
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
      title={{ value: isCreateMode ? 'Créer un claim' : 'Modifier le claim' }}
      contentStyle="max-h-[90vh] overflow-y-auto"
    >
      <GenericForm
        key={claim?.id ?? 'create'}
        schema={claimEditSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <SelectRHF
          name="itemId"
          label="Ressource: "
          options={itemOptions}
          placeholder="Choisir une ressource..."
        />
        <InputRHF
          name="quantity"
          label="Quantité: "
          type="number"
          min={1}
          step="1"
          registerOptions={{ valueAsNumber: true }}
        />
        <div className="grid grid-cols-2 gap-2">
          <InputRHF
            name="latitude"
            label="Latitude: "
            type="number"
            step="1"
            registerOptions={{ valueAsNumber: true }}
          />
          <InputRHF
            name="longitude"
            label="Longitude: "
            type="number"
            step="1"
            registerOptions={{ valueAsNumber: true }}
          />
        </div>
        <InputRHF
          name="depth"
          label="Profondeur: "
          type="number"
          min={0}
          step="any"
          registerOptions={{ valueAsNumber: true }}
        />
        <CheckboxRHF name="depleted" label="Depleted" />
        <FormButtonsSection
          submitDisabled={patchClaim.isPending}
          cancelDisabled={patchClaim.isPending}
          submitLabel={isCreateMode ? 'Créer' : 'Enregistrer'}
          onCancel={close}
        />
      </GenericForm>
    </ModalGeneric>
  );
}

export default MiningClaimEditModal;
