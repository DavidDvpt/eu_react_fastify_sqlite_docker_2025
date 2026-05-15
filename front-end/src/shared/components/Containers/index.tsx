import type { ContainerBaseProps } from "@/shared/types";
import Container from "./Container";

export const Panel = (props: ContainerBaseProps) => (
  <Container variant="panel" {...props} />
);

export const Section = (props: ContainerBaseProps) => (
  <Container variant="section" {...props} />
);

export const SubSection = (props: ContainerBaseProps) => (
  <Container variant="subsection" {...props} />
);
