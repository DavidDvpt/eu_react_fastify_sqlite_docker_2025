import { describe, expect, it } from "vitest";

import { loginSchema } from "../validations";

describe("signInSchema", () => {
  it("accepts a valid payload", () => {
    const result = loginSchema.safeParse({
      pseudo: "fredericFrancois",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects short pseudo", () => {
    const result = loginSchema.safeParse({
      pseudo: "height",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.pseudo?.[0]).toBe(
        "Le pseudo doit être de 8 caractères minimim"
      );
    }
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "fredericFrancois",
      password: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        "Le mot de passe doit être de 8 caractères minimim"
      );
    }
  });
});
