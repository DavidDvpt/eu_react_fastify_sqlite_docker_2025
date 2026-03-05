import { describe, expect, it } from "vitest";

import { meParser } from "../authParser";

describe("authParser", () => {
  describe("meParser", () => {
    it("maps valid api user to auth me shape", async () => {
      const result = await meParser({
        id: "1",
        pseudo: "john-doe",
        role: "USER",
        email: "john@test.com",
        date_created: "2026-03-05T00:00:00.000Z",
        is_active: true,
      });

      expect(result).toEqual({
        id: "1",
        pseudo: "john-doe",
        role: "USER",
        isActive: true,
      });
    });

    it("rejects when id is missing", async () => {
      await expect(
        meParser({
          id: "",
          pseudo: "john-doe",
          role: "USER",
          email: "john@test.com",
          date_created: "2026-03-05T00:00:00.000Z",
          is_active: true,
        })
      ).rejects.toThrow("No userId found");
    });

    it("rejects when pseudo is missing", async () => {
      await expect(
        meParser({
          id: "1",
          pseudo: "",
          role: "USER",
          email: "john@test.com",
          date_created: "2026-03-05T00:00:00.000Z",
          is_active: true,
        })
      ).rejects.toThrow("No pseudo found");
    });

    it("rejects when role is missing", async () => {
      await expect(
        meParser({
          id: "1",
          pseudo: "john-doe",
          role: null,
          email: "john@test.com",
          date_created: "2026-03-05T00:00:00.000Z",
          is_active: true,
        })
      ).rejects.toThrow("No role found");
    });
  });
});
