import { env } from "@/config/env";

const API_URL = env.VITE_API_URL ?? "";
const IMAGE_BASE_URL = env.VITE_IMAGE_BASE_URL ?? "";
type ImageSize = "micro" | "normal";

class ImageService {
  static getItemImageUrl(
    imageUrlId: string,
    size: ImageSize = "normal",
  ): string | null {
    const normalizedImageBaseUrl = IMAGE_BASE_URL.replace(/\/+$/, "");
    const normalizedApiUrl = API_URL.replace(/\/+$/, "");
    const baseUrl =
      normalizedImageBaseUrl ||
      (normalizedApiUrl ? `${normalizedApiUrl}/assets/images` : "");
    if (!baseUrl || !imageUrlId) {
      return null;
    }
    const encodedImageId = encodeURIComponent(imageUrlId);
    const sizeQuery = `?size=${size}`;

    return `${baseUrl}/${encodedImageId}${sizeQuery}`;
  }
}

export { ImageService };
