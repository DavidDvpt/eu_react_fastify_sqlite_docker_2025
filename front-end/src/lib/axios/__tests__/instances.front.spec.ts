import { describe, expect, it } from "vitest";
import { axiosInstance, axiosPublicInstance } from "../instances";

describe("axios instances", () => {
  it("should have the same base config", () => {
    expect(axiosInstance().defaults.baseURL).toBe(import.meta.env.VITE_API_URL);

    expect(axiosPublicInstance.defaults.baseURL).toBe(
      import.meta.env.VITE_API_URL
    );

    expect(axiosInstance().defaults.timeout).toBe(20_000);
    expect(axiosPublicInstance.defaults.timeout).toBe(20_000);
  });

  it("should set withCredentials only on private instance", () => {
    expect(axiosInstance().defaults.withCredentials).toBe(true);
    expect(axiosPublicInstance.defaults.withCredentials).toBeUndefined();
  });

  it("should be two different instances", () => {
    expect(axiosInstance).not.toBe(axiosPublicInstance);
  });
});
