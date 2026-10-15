import type { NavbarButtonType } from "@/shared/types";

const MINING_NAV_LINKS: NavbarButtonType[] = [
  {
    key: "Créer",
    content: "Créer",
    route: "/mining/create",
    variant: "navVertical",
  },
  {
    key: "Sessions",
    content: "Sessions",
    route: "/mining",
    variant: "navVertical",
  },
];

export { MINING_NAV_LINKS };
