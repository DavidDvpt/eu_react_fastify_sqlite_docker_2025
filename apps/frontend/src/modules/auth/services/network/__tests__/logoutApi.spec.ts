import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockLogout } = vi.hoisted(() => ({
  mockLogout: vi.fn(),
}));

vi.mock("@/api/generated/react-query/entropiaManagerAPI", () => ({
  logoutApiV2AuthLogoutPost: mockLogout,
}));

import logoutApi from "../logoutApi";

describe("logoutApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogout.mockReset();
  });

  it("posts to auth/logout", async () => {
    mockLogout.mockResolvedValueOnce({ message: "Logged out" });

    await logoutApi();

    expect(mockLogout).toHaveBeenCalledWith();
  });

  it("returns backend response as-is", async () => {
    mockLogout.mockResolvedValueOnce({ message: "Logged out" });

    const result = await logoutApi();

    expect(result).toEqual({ message: "Logged out" });
  });
});
