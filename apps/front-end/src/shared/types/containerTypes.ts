import type { HTMLAttributes, PropsWithChildren } from "react";

// type ContainerType = "Panel" | "Section" | "SubSection";
export type ContainerVariant =
  "default" | "modal" | "panel" | "section" | "subsection" | "modal";
export type ContainerType = ContainerVariant;
export type ContainerBaseProps = Omit<ContainerProps, "type">;
export interface ContainerProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  variant?: ContainerVariant;
  disableShadow?: boolean;
}

export type PanelProps = Omit<ContainerProps, "variant" | "disableShadow">;
