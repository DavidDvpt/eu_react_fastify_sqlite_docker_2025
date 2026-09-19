/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_IMAGE_BASE_URL?: string;
  }

  interface Window {
    __APP_CONFIG__?: {
      API_URL?: string;
      IMAGE_BASE_URL?: string;
    };
  }
}

export {};