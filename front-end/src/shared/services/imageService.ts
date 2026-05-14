const API_URL = import.meta.env.VITE_API_URL ?? "";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? "";
type ImageSize = "micro" | "normal";

class ImageService {
  static getItemImageUrl(
    imageUrlId: string,
    size: ImageSize = "normal",
  ): string | null {
    console.log(IMAGE_BASE_URL);
    const normalizedImageBaseUrl = IMAGE_BASE_URL.replace(/\/+$/, "");
    const normalizedApiUrl = API_URL.replace(/\/+$/, "");
    const baseUrl =
      normalizedImageBaseUrl || (normalizedApiUrl ? "/images" : "");
    console.log(normalizedImageBaseUrl);
    if (!baseUrl || !imageUrlId) {
      return null;
    }
    const encodedImageId = encodeURIComponent(imageUrlId);
    const sizeQuery = size === "micro" ? "?size=micro" : "";

    return `${baseUrl}/${encodedImageId}${sizeQuery}`;
  }
}

export { ImageService };
