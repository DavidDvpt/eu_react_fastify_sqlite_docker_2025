import { useLocation } from "react-router-dom";
import type { NavbarButtonType } from "../types";
import { MANAGE_NAV_LINKS } from "@/modules/manage";

function useNavLinks(): NavbarButtonType[] {
  const location = useLocation();

  // Sécurisez le résultat de useLocation
  const pathname = location?.pathname || "/";

  if (pathname.startsWith("/manage")) return [...MANAGE_NAV_LINKS];

  return [];
}

export default useNavLinks;
