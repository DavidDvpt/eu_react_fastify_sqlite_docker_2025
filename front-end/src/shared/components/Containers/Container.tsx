import { cn } from "@/lib/utils";

import type { ContainerProps } from "@/shared/types";

function Container({ children, className, type, variant = "default" }: ContainerProps) {
  const styleBase = "rounded-md p-2";
  const sectionVariantClassName =
    variant === "modal"
      ? "bg-section-modal-bg border border-section-modal-border text-section-modal-text rounded-[var(--radius-md)]"
      : "bg-section-bg border border-section-border text-section-text shadow-section";

  return (
    <section
      className={cn(
        type === "Section" && `${styleBase} ${sectionVariantClassName}`,
        type === "SubSection" && "",
        className,
      )}
    >
      {children}
    </section>
  );
}

export default Container;
