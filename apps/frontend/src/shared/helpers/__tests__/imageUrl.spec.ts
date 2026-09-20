import { env } from "@/config/env";
import { describe, expect, it } from "vitest";
import { getItemImageUrl } from "../imageUrl";

describe("getItemImageUrl", () => {
  it("returns null when image id is empty", () => {
    expect(getItemImageUrl("")).toBeNull();
  });

  it("builds an encoded image url", () => {
    const result = getItemImageUrl("A B");
    const expectedBaseUrl = (env.VITE_IMAGE_BASE_URL ?? "/images").replace(
      /\/+$/,
      "",
    );

    expect(result).toBe(
      `${expectedBaseUrl}/${encodeURIComponent("A B")}?size=normal`,
    );
  });

  it("supports micro size", () => {
    const result = getItemImageUrl("123", "micro");
    const expectedBaseUrl = (env.VITE_IMAGE_BASE_URL ?? "/images").replace(
      /\/+$/,
      "",
    );

    expect(result).toBe(`${expectedBaseUrl}/123?size=micro`);
  });
});
