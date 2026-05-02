import { describe, expect, it } from "vitest";

import { MANAGE_NAV_LINKS, isManageTab } from "../manageConfig";

describe("manageConfig", () => {
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
