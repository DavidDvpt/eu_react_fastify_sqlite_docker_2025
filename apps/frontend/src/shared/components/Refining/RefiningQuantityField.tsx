import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import InputRHF from '@/shared/components/form/Input/InputRHF';
import type { RefiningFormValues } from '@/shared/schemas';
import { FormatTools } from '@/shared/tools';

type RefiningQuantityFieldProps = {
  selectedResultId: string | null;
  linesPending: boolean;
  ppcm: number;
  maxClickCount: number;
  refinerDecays: ReadonlyMap<string, number>;
};

function RefiningQuantityField({
  selectedResultId,
  linesPending,
  ppcm,
  maxClickCount,
  refinerDecays,
}: RefiningQuantityFieldProps) {
  const { getValues, setValue } = useFormContext<RefiningFormValues>();
  const clickCount = useWatch<RefiningFormValues, 'clickCount'>({
    name: 'clickCount',
  });
  const refinerLotId = useWatch<RefiningFormValues, 'refinerLotId'>({
    name: 'refinerLotId',
  });
  const refiningDecay = refinerDecays.get(refinerLotId) ?? 0;
  const refiningCost =
    refiningDecay * (typeof clickCount === 'number' ? clickCount : 0);

  useEffect(() => {
    if (selectedResultId && !linesPending) {
      const currentClickCount = getValues('clickCount');
      if (currentClickCount !== maxClickCount) {
        setValue('clickCount', maxClickCount, { shouldValidate: true });
      }
    }
  }, [getValues, linesPending, maxClickCount, selectedResultId, setValue]);

  return (
    <div className="flex flex-col gap-1.5">
      <InputRHF
        name="clickCount"
        label="Quantité (résultats)"
        type="number"
        min={maxClickCount > 0 ? ppcm : 0}
        max={maxClickCount}
        step={ppcm}
        registerOptions={{ valueAsNumber: true }}
      />
      <p className="m-0 text-xs text-text-muted">
        Multiple de {ppcm} — maximum {maxClickCount} résultat
        {maxClickCount > 1 ? 's' : ''}
      </p>
      <p className="m-0 text-xs text-text-muted">
        Coût decay total :{' '}
        {FormatTools.pedFormat({ decimalMini: 2, decimalMaxi: 5 }).format(
          refiningCost,
        )}{' '}
        PED
      </p>
    </div>
  );
}

export default RefiningQuantityField;
