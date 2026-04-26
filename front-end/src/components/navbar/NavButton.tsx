import { NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { NavbarButtonType } from "@/shared/types";

function NavButton(props: NavbarButtonType) {
  const { pathname } = useLocation();

  const isActive = props.isBrand
    ? false
    : pathname === props.route || pathname.startsWith(`${props.route}/`);

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
