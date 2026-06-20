import { UrlParamFlag } from "@/shared/components";
import { Section } from "@/shared/components/Containers";

function InventoryListFilter() {
  return (
    <Section className="flex min-h-0 flex-row gap-4" shadow={false}>
      <UrlParamFlag
        kind="checkbox"
        paramKey="showAllItems"
        checkboxLabel="Tous les objets"
      />

      <UrlParamFlag
        kind="switch"
        paramKey="cardView"
        switchTrueLabel="Card"
        switchFalseLabel="Row"
        containerClassName="flex flex-row items-center gap-2 py-0"
        labelClassName="text-sm font-medium tracking-wide text-input-label"
      />
    </Section>
  );
}

export default InventoryListFilter;
