import type { ReactNode } from "react";

type NavbarButtonType = {
  key?: string;
  content: ReactNode;
  route: string;
  selected?: boolean;
  onClick?: () => void;
  adminOnly?: boolean;
  isBrand?: boolean;
  className?: string;
  isActive?: boolean;
  disabled?: boolean;
  variant: "navVertical" | "navHorizontal";
};

export type { NavbarButtonType };
