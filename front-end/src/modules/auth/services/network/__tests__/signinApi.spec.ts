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

import signinApi from "../signinApi";

describe("signinApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance.mockReturnValue({});
    mockAxiosCrud.mockReturnValue({ post: mockPost });
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
    mockPost.mockResolvedValueOnce({ message: "Success" });

    await signinApi({
      pseudo: "john-doe",
      password: "password123",
    });

    expect(mockPost).toHaveBeenCalledWith(
      `${env.VITE_API_URL}/auth/signin`,
      {
        pseudo: "john-doe",
        password: "password123",
      }
    );
  });

  it("returns backend response as-is", async () => {
    mockPost.mockResolvedValueOnce({ message: "Success" });

    const result = await signinApi({
      pseudo: "john-doe",
      password: "password123",
    });

    expect(result).toEqual({ message: "Success" });
  });
});
