import { getImageBaseUrl } from "@/config/runtime";
type ImageSize = "micro" | "normal";

class ImageService {
  static getItemImageUrl(
    imageUrlId: string,
    size: ImageSize = "normal",
  ): string | null {
    const baseUrl = getImageBaseUrl();
    if (!baseUrl || !imageUrlId) {
      return null;
    }
    const encodedImageId = encodeURIComponent(imageUrlId);
    const sizeQuery = `?size=${size}`;

    return `${baseUrl}/${encodedImageId}${sizeQuery}`;
  }
}

export { ImageService };
