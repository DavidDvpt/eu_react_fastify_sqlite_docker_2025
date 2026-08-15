import type { MANAGE_TABS } from "@/pages/managePage/utils";
import type { CategoryDto, ItemDto, TypeDto } from "@eu/types";

export type ManageTab = (typeof MANAGE_TABS)[number];

export type ManageListRow = CategoryDto | TypeDto | ItemDto;
