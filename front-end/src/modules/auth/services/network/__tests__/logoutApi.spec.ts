import { env } from "@/config/env";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPost, mockAxiosCrud, mockAxiosInstance } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockAxiosCrud: vi.fn(),
  mockAxiosInstance: vi.fn(),
}));

vi.mock("@/lib/axios/crud", () => ({
  axiosCrud: (...args: unknown[]) => mockAxiosCrud(...args),
}));

vi.mock("@/lib/axios/instances", () => ({
  axiosInstance: () => mockAxiosInstance(),
}));

import logoutApi from "../logoutApi";

describe("logoutApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance.mockReturnValue({});
    mockAxiosCrud.mockReturnValue({ post: mockPost });
  });

  it("posts to auth/logout", async () => {
    mockPost.mockResolvedValueOnce({ message: "Logged out" });

    await logoutApi();

    expect(mockPost).toHaveBeenCalledWith(
      `${env.VITE_API_URL}/auth/logout`,
      {}
    );
  });

  it("returns backend response as-is", async () => {
    mockPost.mockResolvedValueOnce({ message: "Logged out" });

    const result = await logoutApi();

    expect(result).toEqual({ message: "Logged out" });
  });
});
