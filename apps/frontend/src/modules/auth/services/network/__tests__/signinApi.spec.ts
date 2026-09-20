import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSignin } = vi.hoisted(() => ({
  mockSignin: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  signinApiV2AuthSigninPost: mockSignin,
}));

import signinApi from "../signinApi";

describe("signinApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignin.mockReset();
  });

  it("rejects when pseudo is missing", async () => {
    await expect(
      signinApi({
        pseudo: "",
        password: "password123",
      })
    ).rejects.toThrow("Pseudo is undefined");
  });

  it("rejects when password is missing", async () => {
    await expect(
      signinApi({
        pseudo: "john-doe",
        password: "",
      })
    ).rejects.toThrow("Password is undefined");
  });

  it("posts signin payload to auth/signin", async () => {
    mockSignin.mockResolvedValueOnce({ message: "Success" });

    await signinApi({
      pseudo: "john-doe",
      password: "password123",
    });

    expect(mockSignin).toHaveBeenCalledWith(
      {
        pseudo: "john-doe",
        password: "password123",
      }
    );
  });

  it("returns backend response as-is", async () => {
    mockSignin.mockResolvedValueOnce({ message: "Success" });

    const result = await signinApi({
      pseudo: "john-doe",
      password: "password123",
    });

    expect(result).toEqual({ message: "Success" });
  });
});
