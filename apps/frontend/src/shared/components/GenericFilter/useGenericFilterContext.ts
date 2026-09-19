import type { DisplayedFields, GenericFilterContext } from "@/shared/types";

const contexts: Record<GenericFilterContext, DisplayedFields> = {
  manageCategory: { category: true, type: true, item: false },
  manageType: { category: true, type: true, item: false },
  manageItem: { category: true, type: true, item: false },
  inventory: { category: true, type: true, item: false },
  transaction: { category: true, type: true, item: true },
};

const useGenericFilterContext = ({
  context,
}: {
  context?: GenericFilterContext;
}) =>
  context ? contexts[context] : { category: true, type: true, item: true };

export default useGenericFilterContext;
