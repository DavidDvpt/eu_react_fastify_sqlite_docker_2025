import { cn } from "@/lib/utils";

import type { ContainerProps } from "@/shared/types";

function Container({ children, className, type }: ContainerProps) {
  const styleBase = "rounded-md p-2";

  return (
    <section
      className={cn(
        type === "Section" &&
          `${styleBase} bg-section-bg border border-section-border text-section-text shadow-section`,
        type === "SubSection" && "",
        className,
      )}
    >
      {children}
    </section>
  );
}

export default Container;
