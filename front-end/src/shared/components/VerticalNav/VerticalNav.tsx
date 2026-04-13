import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

type VerticalNavItem = {
  key: string;
  content: ReactNode;
  to?: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

type VerticalNavProps = {
  items: VerticalNavItem[];
  className?: string;
};

function VerticalNav({ items, className }: VerticalNavProps) {
  const { pathname } = useLocation();

  const isRouteActive = (to: string) =>
    pathname === to || pathname.startsWith(`${to}/`);

  return (
    <nav className={className ?? "space-y-2"}>
      {items.map((item) => {
        if (item.to) {
          const isActive = isRouteActive(item.to);
          return (
            <Button
              key={item.key}
              asChild
              variant="navVertical"
              size="nav"
              data-active={isActive}
            >
              <NavLink to={item.to}>{item.content}</NavLink>
            </Button>
          );
        }

        return (
          <Button
            key={item.key}
            type="button"
            onClick={item.onClick}
            disabled={item.disabled}
            variant="navVertical"
            size="nav"
            data-active={item.isActive}
          >
            {item.content}
          </Button>
        );
      })}
    </nav>
  );
}

export { VerticalNav };
export type { VerticalNavItem };
