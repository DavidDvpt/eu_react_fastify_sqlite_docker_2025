import { NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { NavbarButtonType } from "@/shared/types";

function NavButton(props: NavbarButtonType) {
  const location = useLocation();

  // Sécurisez le résultat de useLocation
  const pathname = location?.pathname || "/";

  const isActive =
    pathname === props.route || pathname.startsWith(`${props.route}/`);

  return (
    <Button
      asChild
      variant={props.variant}
      data-active={isActive}
      className={props.className}
      size="nav"
    >
      <NavLink to={props.route}>{props.content}</NavLink>
    </Button>
  );
}

export default NavButton;
