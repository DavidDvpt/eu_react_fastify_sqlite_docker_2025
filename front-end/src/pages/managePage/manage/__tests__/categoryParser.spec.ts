import { describe, expect, it } from "vitest";

import {
  parseCategories,
  parseCategory,
} from "../../../../lib/parsers/categoryParser";

describe("categoryParser", () => {
  it("parses one category from snake_case to camelCase", async () => {
    const parsed = await parseCategory({
      id: "cat-1",
      name: "Material",
      is_active: true,
      user_id: null,
      date_created: "2026-04-06T00:00:00.000Z",
      date_updated: null,
    });

    expect(parsed).toEqual({
      id: "cat-1",
      name: "Material",
      isActive: true,
      userId: null,
      createdAt: "2026-04-06T00:00:00.000Z",
      updatedAt: null,
    });
  });

  it("parses a list of categories", async () => {
    const parsed = await parseCategories([
      {
        id: "cat-1",
        name: "Material",
        is_active: true,
        user_id: null,
        date_created: "2026-04-06T00:00:00.000Z",
        date_updated: null,
      },
      {
        id: "cat-2",
        name: "Custom",
        is_active: true,
        user_id: "user-1",
        date_created: "2026-04-06T00:00:00.000Z",
        date_updated: "2026-04-06T01:00:00.000Z",
      },
    ]);

    expect(parsed[1].userId).toBe("user-1");
    expect(parsed[1].updatedAt).toBe("2026-04-06T01:00:00.000Z");
  });

  it("rejects invalid payloads", async () => {
    await expect(
      parseCategory({
        id: "",
        name: "Material",
        is_active: true,
        user_id: null,
        date_created: "2026-04-06T00:00:00.000Z",
        date_updated: null,
      }),
    ).rejects.toThrow("No valid category id found");
  });
});
