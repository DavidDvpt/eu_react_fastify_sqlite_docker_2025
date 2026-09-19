import { cn } from "@/lib/utils";

import type { ContainerProps } from "@/shared/types";
import { cva } from "class-variance-authority";

const containerVariants = cva("", {
  variants: {
    variant: {
      default: "",
      panel:
        "m-0 box-border flex h-full max-h-[100dvh] min-h-0 w-full max-w-[100dvw] min-w-0 flex-col bg-transparent p-[10px] shadow-none overflow-x-hidden overflow-y-auto",
      section:
        "rounded-lg flex flex-col text-text bg-surface border-border p-2 shadow-ambient-md",
      subsection: "",
      modal:
        "rounded-lg flex flex-col bg-section-modal-bg shadow-ambient text-text rounded-[var(--radius-md)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Container({
  children,
  className,
  variant = "default",
  disableShadow = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        containerVariants({ variant }),
        disableShadow && "shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
