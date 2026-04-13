const API_URL = import.meta.env.VITE_API_URL ?? "";
type ImageSize = "micro" | "normal";

class ImageService {
  static getItemImageUrl(imageUrlId: string, size: ImageSize = "normal"): string | null {
    const normalizedApiUrl = API_URL.replace(/\/+$/, "");
    if (!normalizedApiUrl || !imageUrlId) {
      return null;
    }
    return `${normalizedApiUrl}/storage/images/${encodeURIComponent(
      imageUrlId
    )}?size=${size}`;
  }
}

export { ImageService };
