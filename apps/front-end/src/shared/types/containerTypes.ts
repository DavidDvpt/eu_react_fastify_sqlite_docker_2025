import type { PropsWithChildren } from "react";

// type ContainerType = "Panel" | "Section" | "SubSection";
export type ContainerVariant =
  "default" | "modal" | "panel" | "section" | "subsection" | "modal";
export type ContainerType = ContainerVariant;
export type ContainerBaseProps = Omit<ContainerProps, "type">;
export interface ContainerProps extends PropsWithChildren {
  variant?: ContainerVariant;
  shadow?: boolean;
  className?: string;
}
