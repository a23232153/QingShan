// src/global.d.ts
export {};

declare global {
  interface Window {
    imagesLoaded: (element: HTMLElement | string, options?: { background: boolean }, callback?: () => void) => void;
  }
}