import { describe, expect, it } from "vitest";

import { userSignUpFormSchema } from "@eu/zod-schemas";

describe("signUpSchema", () => {
  it("accepts a valid payload", () => {
    const result = userSignUpFormSchema.safeParse({
      pseudo: "frederic",
      firstname: "Frederic",
      lastname: "Francois",
      email: "frederic@test.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects short pseudo", () => {
    const result = userSignUpFormSchema.safeParse({
      pseudo: "abc",
      email: "frederic@test.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.pseudo?.[0]).toBe(
        "Too small: expected string to have >=8 characters"
      );
    }
  });

  it("rejects invalid email", () => {
    const result = userSignUpFormSchema.safeParse({
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
    const result = userSignUpFormSchema.safeParse({
      pseudo: "frederic",
      email: "frederic@test.com",
      password: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        "Le mot de passe doit être de 8 caractères minimim"
      );
    }
  });

  it("transforms empty optional names to undefined", () => {
    const result = userSignUpFormSchema.safeParse({
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
