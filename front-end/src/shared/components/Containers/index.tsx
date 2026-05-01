import type { ContainerBaseProps } from "@/shared/types";
import Container from "./Container";

export const Panel = (props: ContainerBaseProps) => (
  <Container
    type="Panel"
    className="mx-auto h-full min-h-0 max-h-[100%] w-full max-w  gap-2 overflow-hidden p-2"
    {...props}
  />
);

export const Section = (props: ContainerBaseProps) => (
  <Container type="Section" {...props} />
);

export const SubSection = (props: ContainerBaseProps) => (
  <Container type="SubSection" {...props} />
);
