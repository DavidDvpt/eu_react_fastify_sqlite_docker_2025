import type { NavbarButtonType } from "@/@types/navbarTypes";
import type { ManageTab } from "@/pages/manage/manageTypes";

const MANAGE_TAB_META = {
  category: {
    title: "Categories",
  },
  type: {
    title: "Types",
  },
  item: {
    title: "Items",
  },
} as const;

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

export { MANAGE_NAV_LINKS, MANAGE_TAB_META, isManageTab };
export type { ManageTab };
