import type { ContainerBaseProps } from "@/shared/types";
import Container from "./Container";

export const Panel = (props: ContainerBaseProps) => (
  <Container type="Panel" {...props} />
);

export const Section = (props: ContainerBaseProps) => (
  <Container type="Section" {...props} />
);

export const SubSection = (props: ContainerBaseProps) => (
  <Container type="SubSection" {...props} />
);
