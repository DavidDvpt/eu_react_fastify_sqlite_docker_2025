import type { MANAGE_TABS } from "@/pages/managePage/utils";
import type { CategoryViewModel, ItemViewModel, TypeViewModel } from "@zod-schemas";

export type ManageTab = (typeof MANAGE_TABS)[number];

export type ManageListRow = CategoryViewModel | TypeViewModel | ItemViewModel;
