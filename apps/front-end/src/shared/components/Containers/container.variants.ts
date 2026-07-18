import { cva } from "class-variance-authority";

export const containerVariants = cva("rounded-lg flex flex-col text-text", {
  variants: {
    variant: {
      default: "",
      panel: "bg-transparent h-full min-h-0 m-2",
      section: "bg-surface border-border p-2 shadow-ambient-md",
      subsection: "bg-bg border-border shadow-none",
      modal:
        "bg-section-modal-bg shadow-ambient text-black rounded-[var(--radius-md)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
