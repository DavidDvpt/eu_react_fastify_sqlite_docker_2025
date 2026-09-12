import { useLocation } from "react-router-dom";
import type { NavbarButtonType } from "../types";
import { MANAGE_NAV_LINKS } from "@/pages/managePage/manageLeftNav";

function useNavLinks(): NavbarButtonType[] {
  const location = useLocation();

  // Sécurisez le résultat de useLocation
  const pathname = location?.pathname || "/";

  if (pathname.startsWith("/manage")) {
    return MANAGE_NAV_LINKS.map((link) => ({
      ...link,
      isActive:
        pathname === link.route || pathname.startsWith(`${link.route}/`),
    }));
  }

  return [];
}

export default useNavLinks;
