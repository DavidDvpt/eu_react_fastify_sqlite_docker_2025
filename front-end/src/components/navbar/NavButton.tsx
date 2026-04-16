import { NavLink, useLocation } from "react-router-dom";
import type { NavbarType } from "../navbarType";
import { Button } from "@/components/ui/button";

function NavButton(props: NavbarType) {
  const { pathname } = useLocation();
  const isActive = props.isBrand
    ? false
    : pathname === props.route || pathname.startsWith(`${props.route}/`);

  return (
    <Button
      asChild
      variant="navHorizontal"
      data-active={isActive}
      className={props.className}
    >
      <NavLink to={props.route}>{props.label}</NavLink>
    </Button>
  );
}

export default NavButton;
