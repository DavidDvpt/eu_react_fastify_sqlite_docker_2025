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

import signupApi from "../signupApi";

describe("signupApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance.mockReturnValue({});
    mockAxiosCrud.mockReturnValue({ post: mockPost });
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
    mockPost.mockResolvedValueOnce({
      user: { id: "1", pseudo: "john", email: "john@test.com", role: "USER" },
    });

    await signupApi({
      pseudo: "john",
      firstname: undefined,
      lastname: undefined,
      email: "john@test.com",
      password: "password123",
    });

    expect(mockPost).toHaveBeenCalledWith(
      `${env.VITE_API_URL}/auth/signup`,
      {
        pseudo: "john",
        email: "john@test.com",
        password: "password123",
      }
    );
  });

  it("includes optional names when provided", async () => {
    mockPost.mockResolvedValueOnce({
      user: { id: "1", pseudo: "john", email: "john@test.com", role: "USER" },
    });

    await signupApi({
      pseudo: "john",
      firstname: "John",
      lastname: "Doe",
      email: "john@test.com",
      password: "password123",
    });

    expect(mockPost).toHaveBeenCalledWith(
      `${env.VITE_API_URL}/auth/signup`,
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
    mockPost.mockResolvedValueOnce({
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
