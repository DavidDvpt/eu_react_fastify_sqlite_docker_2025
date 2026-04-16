import Container from "./Container";
import type {
  ContainerProps,
  ContainerBaseProps,
  ContainerType,
} from "../../../@types/containerTypes";

export const Panel = (props: ContainerBaseProps) => (
  <Container type="Panel" {...props} />
);

export const Section = (props: ContainerBaseProps) => (
  <Container type="Section" {...props} />
);

export const SubSection = (props: ContainerBaseProps) => (
  <Container type="SubSection" {...props} />
);
export { Container };
export type { ContainerProps, ContainerType, ContainerBaseProps };
