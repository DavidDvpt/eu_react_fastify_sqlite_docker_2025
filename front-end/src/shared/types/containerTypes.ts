import type { PropsWithChildren } from "react";

type ContainerType = "Panel" | "Section" | "SubSection";
type ContainerVariant = "default" | "modal";
type ContainerBaseProps = Omit<ContainerProps, "type">;
interface ContainerProps extends PropsWithChildren {
  type: ContainerType;
  variant?: ContainerVariant;
  className?: string;
}

export type { ContainerType, ContainerVariant, ContainerProps, ContainerBaseProps };
