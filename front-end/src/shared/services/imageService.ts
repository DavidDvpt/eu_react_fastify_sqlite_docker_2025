const API_URL = import.meta.env.VITE_API_URL ?? "";

class ImageService {
  static getItemImageUrl(imageUrlId: string): string | null {
    const normalizedApiUrl = API_URL.replace(/\/+$/, "");
    if (!normalizedApiUrl || !imageUrlId) {
      return null;
    }
    return `${normalizedApiUrl}/storage/images/${encodeURIComponent(imageUrlId)}/normal`;
  }
}

export { ImageService };
