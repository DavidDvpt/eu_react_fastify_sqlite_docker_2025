import { describe, expect, it } from "vitest";
import {
  getManageCreateLabel,
  isManageTab,
  MANAGE_NAV_LINKS,
} from "../manageLeftNav";

describe("manageLeftTab", () => {
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

  it("builds the create label from the selected tab", () => {
    expect(getManageCreateLabel("category")).toBe("Créer categorie");
    expect(getManageCreateLabel("type")).toBe("Créer type");
    expect(getManageCreateLabel("item")).toBe("Créer item");
  });
});
