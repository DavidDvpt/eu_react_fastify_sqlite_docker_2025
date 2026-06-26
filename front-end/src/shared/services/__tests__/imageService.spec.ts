import { env } from "@/config/env";
import { describe, expect, it } from "vitest";
import { ImageService } from "../imageService";

describe("ImageService", () => {
  it("returns null when image id is empty", () => {
    expect(ImageService.getItemImageUrl("")).toBeNull();
  });

  it("builds encoded image url when API base url exists", () => {
    const imageBaseUrl = env.VITE_IMAGE_BASE_URL ?? "";
    const apiUrl = env.VITE_API_URL ?? "";
    const normalizedImageBaseUrl = imageBaseUrl.replace(/\/+$/, "");
    const expectedBaseUrl = normalizedImageBaseUrl || getFallbackImageBaseUrl(apiUrl);
    const result = ImageService.getItemImageUrl("A B");

    if (!expectedBaseUrl) {
      expect(result).toBeNull();
      return;
    }

    expect(result).toBe(`${expectedBaseUrl}/${encodeURIComponent("A B")}?size=normal`);
  });

  it("supports micro size", () => {
    const imageBaseUrl = env.VITE_IMAGE_BASE_URL ?? "";
    const apiUrl = env.VITE_API_URL ?? "";
    const normalizedImageBaseUrl = imageBaseUrl.replace(/\/+$/, "");
    const expectedBaseUrl = normalizedImageBaseUrl || getFallbackImageBaseUrl(apiUrl);
    const result = ImageService.getItemImageUrl("123", "micro");

    if (!expectedBaseUrl) {
      expect(result).toBeNull();
      return;
    }

    expect(result).toBe(`${expectedBaseUrl}/123?size=micro`);
  });
});

function getFallbackImageBaseUrl(apiUrl: string) {
  if (!apiUrl) {
    return "";
  }

  if (URL.canParse(apiUrl)) {
    return `${new URL(apiUrl).origin}/images`;
  }

  const normalizedApiUrl = apiUrl.replace(/\/+$/, "");
  const apiPrefix = normalizedApiUrl.match(/^(.*)\/api\/v\d+(?:\/.*)?$/);

  if (apiPrefix?.[1]) {
    return `${apiPrefix[1]}/images`;
  }

  return `${normalizedApiUrl}/images`;
}
