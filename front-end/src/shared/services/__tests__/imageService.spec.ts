import { env } from "@/config/env";
import { describe, expect, it } from "vitest";
import { ImageService } from "../imageService";

describe("ImageService", () => {
  it("returns null when image id is empty", () => {
    expect(ImageService.getItemImageUrl("")).toBeNull();
  });

  it("builds encoded image url from the image base url", () => {
    const result = ImageService.getItemImageUrl("A B");
    const expectedBaseUrl = (env.VITE_IMAGE_BASE_URL ?? "/images").replace(
      /\/+$/,
      "",
    );

    expect(result).toBe(
      `${expectedBaseUrl}/${encodeURIComponent("A B")}?size=normal`,
    );
  });

  it("supports micro size", () => {
    const result = ImageService.getItemImageUrl("123", "micro");
    const expectedBaseUrl = (env.VITE_IMAGE_BASE_URL ?? "/images").replace(
      /\/+$/,
      "",
    );

    expect(result).toBe(`${expectedBaseUrl}/123?size=micro`);
  });
});
