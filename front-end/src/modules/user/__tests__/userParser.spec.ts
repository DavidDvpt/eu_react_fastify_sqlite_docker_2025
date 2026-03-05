import { describe, expect, it } from "vitest";

import { userParser } from "../userParser";

describe("userParser", () => {
  it("maps a valid api user to ui user shape", async () => {
    const result = await userParser({
      id: "1",
      firstname: "John",
      lastname: "Doe",
      pseudo: "john-doe",
      email: "john@test.com",
      role: "USER",
      date_created: "2026-03-05T00:00:00.000Z",
      date_updated: null,
      is_active: true,
    });

    expect(result).toEqual({
      id: "1",
      firstname: "John",
      lastname: "Doe",
      pseudo: "john-doe",
      email: "john@test.com",
      role: "USER",
      createdAt: "2026-03-05T00:00:00.000Z",
      updatedAt: null,
      isActive: true,
    });
  });

  it("normalizes optional fields to null", async () => {
    const result = await userParser({
      id: "1",
      pseudo: "john-doe",
      email: "john@test.com",
      role: "ADMIN",
      date_created: "2026-03-05T00:00:00.000Z",
      is_active: true,
    });

    expect(result.firstname).toBeNull();
    expect(result.lastname).toBeNull();
    expect(result.updatedAt).toBeNull();
  });

  it("rejects when required fields are missing", async () => {
    await expect(
      userParser({
        id: "",
        pseudo: "",
        email: "",
        role: null,
        date_created: "2026-03-05T00:00:00.000Z",
        is_active: true,
      })
    ).rejects.toThrow("No userId found");
  });
});
