import { describe, expect, it } from "vitest";
import { ImageService } from "../imageService";

describe("ImageService", () => {
  it("returns null when image id is empty", () => {
    expect(ImageService.getItemImageUrl("")).toBeNull();
  });

  it("builds encoded image url when API base url exists", () => {
    const apiUrl = import.meta.env.VITE_API_URL ?? "";
    const normalizedApiUrl = apiUrl.replace(/\/+$/, "");
    const result = ImageService.getItemImageUrl("A B");

    if (!normalizedApiUrl) {
      expect(result).toBeNull();
      return;
    }

    expect(result).toBe(
      `${normalizedApiUrl}/storage/images/${encodeURIComponent("A B")}`
    );
  });

  it("supports micro size", () => {
    const apiUrl = import.meta.env.VITE_API_URL ?? "";
    const normalizedApiUrl = apiUrl.replace(/\/+$/, "");
    const result = ImageService.getItemImageUrl("123", "micro");

    if (!normalizedApiUrl) {
      expect(result).toBeNull();
      return;
    }

    expect(result).toBe(`${normalizedApiUrl}/storage/images/123?size=micro`);
  });
});
