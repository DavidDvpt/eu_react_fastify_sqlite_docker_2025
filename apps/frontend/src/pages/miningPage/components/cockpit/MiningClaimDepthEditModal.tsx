import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch } from '@/api/generated/react-query/entropiaManagerAPI';
import type { MiningClaimResponse } from '@/api/generated/react-query/model/miningClaimResponse';
import { GenericForm } from '@/shared/components/form/Genericform';
import FormButtonsSection from '@/shared/components/form/FormButtonsSection';
import InputRHF from '@/shared/components/form/Input/InputRHF';
import { ModalGeneric } from '@/shared/components';
import { InvalidateQueryAndKeys } from '@/lib/react-query/InvalidateQueryAndKeys';
import { ObjectHelper } from '@/shared/helpers/ObjectHelper';

const depthSchema = z.object({
  depth: z.preprocess(
    (value) => (value === '' || Number.isNaN(value) ? undefined : value),
    z.number().positive(),
  ),
});

type DepthValues = z.output<typeof depthSchema>;

type MiningClaimDepthEditModalProps = {
  sessionId: string;
  claims: MiningClaimResponse[];
};

function MiningClaimDepthEditModal({
  sessionId,
  claims,
}: MiningClaimDepthEditModalProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const claimId = searchParams.get('depthClaimId');
  const claim = claims.find((entry) => entry.id === claimId);
  const patchClaim = usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch();

  const close = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('depthClaimId');
    setSearchParams(next);
  };

  if (!claimId || !claim) return null;

  const handleSubmit = async (values: DepthValues) => {
    if (!claim.id.startsWith('__fake-claim-')) {
      await patchClaim.mutateAsync({
        sessionId,
        claimId: claim.id,
        data: ObjectHelper.omitNullish({ depth: values.depth }),
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
      title={{ value: 'Modifier la profondeur' }}
    >
      <GenericForm
        key={claim.id}
        schema={depthSchema}
        defaultValues={{ depth: claim.depth ?? undefined }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <InputRHF
          name="depth"
          label="Profondeur :"
          type="number"
          min={0}
          step="any"
          registerOptions={{ valueAsNumber: true }}
        />
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

export default MiningClaimDepthEditModal;
