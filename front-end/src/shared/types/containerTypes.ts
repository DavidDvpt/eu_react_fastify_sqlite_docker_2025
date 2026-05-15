import type { PropsWithChildren } from "react";

// type ContainerType = "Panel" | "Section" | "SubSection";
type ContainerVariant =
  | "default"
  | "modal"
  | "panel"
  | "section"
  | "subsection"
  | "modal";
type ContainerBaseProps = Omit<ContainerProps, "type">;
interface ContainerProps extends PropsWithChildren {
  variant?: ContainerVariant;
  className?: string;
}

export type { ContainerVariant, ContainerProps, ContainerBaseProps };
