import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import { formLabelClassName } from "@/shared/components/form/form.styles";
import { REFINING_PROVENANCES } from "@/shared/helpers";

const PROVENANCE_LABELS = { TRADE: "Trade", MINING: "Minage", CRAFTING: "Crafting" } as const;

type RefiningProvenanceFieldsProps = {
  onProvenanceChange: (provenance: (typeof REFINING_PROVENANCES)[number], checked: boolean) => void;
};

function RefiningProvenanceFields({ onProvenanceChange }: RefiningProvenanceFieldsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className={formLabelClassName}>Provenance</span>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {REFINING_PROVENANCES.map((provenance) => (
          <CheckboxRHF
            key={provenance}
            name="provenance"
            checkedValue={provenance}
            label={PROVENANCE_LABELS[provenance]}
            onCheckedChange={(checked) => onProvenanceChange(provenance, checked)}
          />
        ))}
      </div>
    </div>
  );
}

export default RefiningProvenanceFields;
