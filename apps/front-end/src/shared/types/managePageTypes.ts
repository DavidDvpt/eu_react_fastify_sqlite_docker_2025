import type { GenericFilterAvailability } from "./genericFilterType";
import type { MANAGE_TABS } from "@/pages/managePage/utils";
import type { CategoryDto, ItemDto, TypeDto } from "@eu/types";

export type ManageTab = (typeof MANAGE_TABS)[number];

export type ManageListRow = CategoryDto | TypeDto | ItemDto;

export type ManageTableProps = {
  activeTab: ManageTab;
  categories: CategoryDto[];
  typesRows: TypeDto[];
  itemsRows: ItemDto[];
  availability: GenericFilterAvailability[];
};

export type ManageFilterRow = {
  categoryId: string | null;
  categoryName: string | null;
  itemTypeId: string | null;
  itemTypeName: string | null;
  itemId: string | null;
  name: string;
  isLimited: boolean;
};
