import { describe, expect, it } from "vitest";

import "@/shared/validation/zodConfig";
import { SignInBody } from "@/api/generated/zod/model/signInBody.zod";

describe("signInSchema", () => {
  it("accepts a valid payload", () => {
    const result = SignInBody.safeParse({
      pseudo: "fredericFrancois",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects short pseudo", () => {
    const result = SignInBody.safeParse({
      pseudo: "height",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.pseudo?.[0]).toBe(
        "Ce champ doit contenir au moins 8 caractères"
      );
    }
  });

  it("rejects short password", () => {
    const result = SignInBody.safeParse({
      email: "fredericFrancois",
      password: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        "Ce champ doit contenir au moins 8 caractères"
      );
    }
  });
});
