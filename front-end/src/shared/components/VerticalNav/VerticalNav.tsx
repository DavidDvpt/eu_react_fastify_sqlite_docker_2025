import { useLocation } from "react-router-dom";
import { NavButton } from "@/components/Navbar";
import type { VerticalNavProps } from "@/shared/types";

function VerticalNav({ items }: VerticalNavProps) {
  const { pathname } = useLocation();

  const isRouteActive = (to: string) =>
    pathname === to || pathname.startsWith(`${to}/`);

  return (
    <aside className={"flex flex-col space-y-2"}>
      {items.map((item) => {
        const isActive = isRouteActive(item.route);

        return (
          <NavButton
            key={item.key}
            variant={item.variant}
            data-active={isActive}
            content={item.content}
            route={item.route}
          ></NavButton>
        );
      })}
    </aside>
  );
}

export { VerticalNav };
