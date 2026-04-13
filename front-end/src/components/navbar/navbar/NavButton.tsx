import { NavLink, useLocation } from "react-router-dom";
import type { NavbarType } from "../navbarType";
import { Button } from "@/components/ui/button";

function NavButton(props: NavbarType) {
  const { pathname } = useLocation();
  const isActive =
    pathname === props.route || pathname.startsWith(`${props.route}/`);

  return (
    <Button asChild variant="navHorizontal" data-active={isActive}>
      <NavLink to={props.route}>{props.label}</NavLink>
    </Button>
  );
}

export default NavButton;
