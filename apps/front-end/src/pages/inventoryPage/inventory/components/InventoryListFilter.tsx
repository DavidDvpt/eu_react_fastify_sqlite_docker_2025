import { cn } from "@/lib/utils";
import { UrlParamFlag } from "@/shared/components";
import { Section } from "@/shared/components/Containers";

function InventoryListFilter({ className }: { className?: string }) {
  return (
    <Section
      className={cn("flex min-h-0 flex-row gap-4", className)}
      shadow={false}
    >
      <UrlParamFlag
        kind="checkbox"
        paramKey="showAllItems"
        checkboxLabel="Tous les objets"
      />

      <UrlParamFlag
        kind="switch"
        paramKey="viewMode"
        switchTrueLabel="Card"
        switchFalseLabel="Row"
        containerClassName="flex flex-row items-center gap-2 py-0"
        labelClassName="text-sm font-medium tracking-wide text-input-label"
        paramValue="card"
      />
    </Section>
  );
}

export default InventoryListFilter;
