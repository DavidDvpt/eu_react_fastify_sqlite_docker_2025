import { getImageBaseUrl } from "@/config/runtime";

type ImageSize = "micro" | "normal";

function getItemImageUrl(
  imageUrlId: string | null,
  size: ImageSize = "normal",
): string | null {
  const baseUrl = getImageBaseUrl();
  if (!baseUrl || !imageUrlId) {
    return null;
  }

  const encodedImageId = encodeURIComponent(imageUrlId);
  return `${baseUrl}/${encodedImageId}?size=${size}`;
}

export { getItemImageUrl };
