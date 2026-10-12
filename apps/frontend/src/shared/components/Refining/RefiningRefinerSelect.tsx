import SelectRHF from "@/shared/components/form/Select/SelectRHF";
import type { SelectOption } from "@/shared/components/form/form.types";

type RefiningRefinerSelectProps = {
  options: SelectOption[];
};

function RefiningRefinerSelect({ options }: RefiningRefinerSelectProps) {
  return (
    <SelectRHF
      name="refinerLotId"
      label="Raffineur"
      options={options}
      placeholder={options.length ? "Sélectionner un raffineur" : "Aucun raffineur disponible"}
      disabled={!options.length}
    />
  );
}

export default RefiningRefinerSelect;
