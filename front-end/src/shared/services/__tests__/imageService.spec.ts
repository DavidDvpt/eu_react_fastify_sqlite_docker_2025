import { describe, expect, it } from "vitest";
import { ImageService } from "../imageService";

describe("ImageService", () => {
  it("returns null when image id is empty", () => {
    expect(ImageService.getItemImageUrl("")).toBeNull();
  });

  it("builds encoded image url when API base url exists", () => {
    const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL ?? "";
    const apiUrl = import.meta.env.VITE_API_URL ?? "";
    const normalizedImageBaseUrl = imageBaseUrl.replace(/\/+$/, "");
    const normalizedApiUrl = apiUrl.replace(/\/+$/, "");
    const expectedBaseUrl =
      normalizedImageBaseUrl || (normalizedApiUrl ? `${normalizedApiUrl}/assets/images` : "");
    const result = ImageService.getItemImageUrl("A B");

    if (!expectedBaseUrl) {
      expect(result).toBeNull();
      return;
    }

    expect(result).toBe(`${expectedBaseUrl}/${encodeURIComponent("A B")}`);
  });

  it("supports micro size", () => {
    const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL ?? "";
    const apiUrl = import.meta.env.VITE_API_URL ?? "";
    const normalizedImageBaseUrl = imageBaseUrl.replace(/\/+$/, "");
    const normalizedApiUrl = apiUrl.replace(/\/+$/, "");
    const expectedBaseUrl =
      normalizedImageBaseUrl || (normalizedApiUrl ? `${normalizedApiUrl}/assets/images` : "");
    const result = ImageService.getItemImageUrl("123", "micro");

    if (!expectedBaseUrl) {
      expect(result).toBeNull();
      return;
    }

    expect(result).toBe(`${expectedBaseUrl}/123?size=micro`);
  });
});
