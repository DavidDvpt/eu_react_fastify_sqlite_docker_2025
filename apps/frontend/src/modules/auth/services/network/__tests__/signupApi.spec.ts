import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSignup } = vi.hoisted(() => ({
  mockSignup: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  signupApiV2AuthSignupPost: mockSignup,
}));

import signupApi from "../signupApi";

describe("signupApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignup.mockReset();
  });

  it("rejects when pseudo is missing", async () => {
    await expect(
      signupApi({
        pseudo: "",
        firstname: undefined,
        lastname: undefined,
        email: "john@test.com",
        password: "password123",
      })
    ).rejects.toThrow("Pseudo is undefined");
  });

  it("rejects when email is missing", async () => {
    await expect(
      signupApi({
        pseudo: "john",
        firstname: undefined,
        lastname: undefined,
        email: "",
        password: "password123",
      })
    ).rejects.toThrow("Email is undefined");
  });

  it("posts required payload without undefined optional fields", async () => {
    mockSignup.mockResolvedValueOnce({
      user: { id: "1", pseudo: "john", email: "john@test.com", role: "USER" },
    });

    await signupApi({
      pseudo: "john",
      firstname: undefined,
      lastname: undefined,
      email: "john@test.com",
      password: "password123",
    });

    expect(mockSignup).toHaveBeenCalledWith(
      {
        pseudo: "john",
        email: "john@test.com",
        password: "password123",
      }
    );
  });

  it("includes optional names when provided", async () => {
    mockSignup.mockResolvedValueOnce({
      user: { id: "1", pseudo: "john", email: "john@test.com", role: "USER" },
    });

    await signupApi({
      pseudo: "john",
      firstname: "John",
      lastname: "Doe",
      email: "john@test.com",
      password: "password123",
    });

    expect(mockSignup).toHaveBeenCalledWith(
      {
        pseudo: "john",
        firstname: "John",
        lastname: "Doe",
        email: "john@test.com",
        password: "password123",
      }
    );
  });

  it("normalizes direct user response into { user } shape", async () => {
    mockSignup.mockResolvedValueOnce({
      id: "1",
      pseudo: "john",
      email: "john@test.com",
      role: "USER",
    });

    const result = await signupApi({
      pseudo: "john",
      firstname: undefined,
      lastname: undefined,
      email: "john@test.com",
      password: "password123",
    });

    expect(result).toEqual({
      user: {
        id: "1",
        pseudo: "john",
        email: "john@test.com",
        role: "USER",
      },
    });
  });
});
