import type { ContainerBaseProps, PanelProps } from "@/shared/types";
import Container from "./Container";

export const Panel = (props: PanelProps) => (
  <Container variant="panel" {...props} />
);

export const Section = (props: ContainerBaseProps) => (
  <Container variant="section" {...props} />
);

export const SubSection = (props: ContainerBaseProps) => (
  <Container variant="subsection" {...props} />
);
