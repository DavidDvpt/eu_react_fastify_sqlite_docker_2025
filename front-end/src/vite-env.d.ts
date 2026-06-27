/// <reference types="vite/client" />

declare global {
  interface Window {
    __APP_CONFIG__?: {
      API_URL?: string;
      IMAGE_BASE_URL?: string;
    };
  }
}

export {};
