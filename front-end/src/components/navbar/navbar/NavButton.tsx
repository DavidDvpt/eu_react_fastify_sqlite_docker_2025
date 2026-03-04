import { NavLink } from "react-router-dom";
import type { NavbarType } from "../navbarType";
import { cn } from "@/lib/utils";

function NavButton(props: NavbarType) {
  return (
    <NavLink
      key={props.label}
      to={props.route}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center justify-center",
          "w-24 px-3 py-2 transition-colors no-underline",
          "text-sm font-medium text-foreground",
          "hover:text-foreground hover:bg-info",
          isActive && "border-b-2 border-danger",
        )
      }
    >
      {props.label}
    </NavLink>
  );
}

export default NavButton;
