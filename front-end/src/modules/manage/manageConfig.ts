import type { NavbarButtonType } from "@/shared/types";
import type { ManageTab } from "./managePage.types";

const MANAGE_NAV_LINKS: NavbarButtonType[] = [
  {
    key: "Categorie",
    content: "Categorie",
    route: "/manage/category",
    variant: "navVertical",
  },
  {
    key: "Type",
    content: "Type",
    route: "/manage/type",
    variant: "navVertical",
  },
  {
    key: "Item",
    content: "Item",
    route: "/manage/item",
    variant: "navVertical",
  },
] as const;

function isManageTab(value: string | undefined): value is ManageTab {
  return value === "category" || value === "type" || value === "item";
}

export { MANAGE_NAV_LINKS, isManageTab };
