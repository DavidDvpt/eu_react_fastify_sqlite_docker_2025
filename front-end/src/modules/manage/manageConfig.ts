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

type ManageTab = keyof typeof MANAGE_TAB_META;

const MANAGE_NAV_LINKS = [
  { label: "Categorie", to: "/manage/category", tab: "category" },
  { label: "Type", to: "/manage/type", tab: "type" },
  { label: "Item", to: "/manage/item", tab: "item" },
] as const;

function isManageTab(value: string | undefined): value is ManageTab {
  return value === "category" || value === "type" || value === "item";
}

export { MANAGE_NAV_LINKS, MANAGE_TAB_META, isManageTab };
export type { ManageTab };
