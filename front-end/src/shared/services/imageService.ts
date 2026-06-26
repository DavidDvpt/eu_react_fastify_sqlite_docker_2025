import { env } from "@/config/env";

const API_URL = env.VITE_API_URL ?? "";
const IMAGE_BASE_URL = env.VITE_IMAGE_BASE_URL ?? "";
type ImageSize = "micro" | "normal";

const getFallbackImageBaseUrl = () => {
  if (!API_URL) {
    return "";
  }

  if (URL.canParse(API_URL)) {
    const parsedUrl = new URL(API_URL);
    return `${parsedUrl.origin}/images`;
  }

  const normalizedApiUrl = API_URL.replace(/\/+$/, "");
  const apiPrefix = normalizedApiUrl.match(/^(.*)\/api\/v\d+(?:\/.*)?$/);

  if (apiPrefix?.[1]) {
    return `${apiPrefix[1]}/images`;
  }

  return `${normalizedApiUrl}/images`;
};

class ImageService {
  static getItemImageUrl(
    imageUrlId: string,
    size: ImageSize = "normal",
  ): string | null {
    const normalizedImageBaseUrl = IMAGE_BASE_URL.replace(/\/+$/, "");
    const baseUrl = normalizedImageBaseUrl || getFallbackImageBaseUrl();
    if (!baseUrl || !imageUrlId) {
      return null;
    }
    const encodedImageId = encodeURIComponent(imageUrlId);
    const sizeQuery = `?size=${size}`;

    return `${baseUrl}/${encodedImageId}${sizeQuery}`;
  }
}

export { ImageService };
