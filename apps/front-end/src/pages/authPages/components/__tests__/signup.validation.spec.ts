import { describe, expect, it } from "vitest";

import { signUpSchema } from "../validations";

describe("signUpSchema", () => {
  it("accepts a valid payload", () => {
    const result = signUpSchema.safeParse({
      pseudo: "frederic",
      firstname: "Frederic",
      lastname: "Francois",
      email: "frederic@test.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects short pseudo", () => {
    const result = signUpSchema.safeParse({
      pseudo: "abc",
      email: "frederic@test.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.pseudo?.[0]).toBe(
        "Le pseudo doit contenir au moins 4 caracteres"
      );
    }
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      pseudo: "frederic",
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe(
        "Email invalide"
      );
    }
  });

  it("rejects short password", () => {
    const result = signUpSchema.safeParse({
      pseudo: "frederic",
      email: "frederic@test.com",
      password: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        "Le mot de passe doit etre de 8 caracteres minimum"
      );
    }
  });

  it("transforms empty optional names to undefined", () => {
    const result = signUpSchema.safeParse({
      pseudo: "frederic",
      firstname: "",
      lastname: "",
      email: "frederic@test.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstname).toBeUndefined();
      expect(result.data.lastname).toBeUndefined();
    }
  });
});
