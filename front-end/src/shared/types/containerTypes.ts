import type { PropsWithChildren } from "react";

type ContainerType = "Panel" | "Section" | "SubSection";
type ContainerBaseProps = Omit<ContainerProps, "type">;
interface ContainerProps extends PropsWithChildren {
  type: ContainerType;
  className?: string;
}

export type { ContainerType, ContainerProps, ContainerBaseProps };
