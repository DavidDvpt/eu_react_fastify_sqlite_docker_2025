import { describe, expect, it } from "vitest";

import {
  MANAGE_NAV_LINKS,
  MANAGE_TAB_META,
  isManageTab,
} from "../manageConfig";

describe("manageConfig", () => {
  it("exposes the expected tabs metadata", () => {
    expect(Object.keys(MANAGE_TAB_META)).toEqual(["category", "type", "item"]);
    expect(MANAGE_TAB_META.category.title).toBe("Categories");
    expect(MANAGE_TAB_META.type.title).toBe("Types");
    expect(MANAGE_TAB_META.item.title).toBe("Items");
  });

  it("exposes left nav links for manage routes", () => {
    expect(MANAGE_NAV_LINKS.map((link) => link.route)).toEqual([
      "/manage/category",
      "/manage/type",
      "/manage/item",
    ]);
  });

  it("validates manage tab values", () => {
    expect(isManageTab("category")).toBe(true);
    expect(isManageTab("type")).toBe(true);
    expect(isManageTab("item")).toBe(true);
    expect(isManageTab("unknown")).toBe(false);
    expect(isManageTab(undefined)).toBe(false);
  });
});
