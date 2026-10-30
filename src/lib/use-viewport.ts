import { useSyncExternalStore } from "react";

export interface Viewport {
  width: number;
  height: number;
}

// Valor do servidor (e do primeiro render): o desktop de referência
const SERVER_VIEWPORT: Viewport = { width: 1440, height: 900 };

let cached: Viewport = SERVER_VIEWPORT;

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

// Mesmo objeto enquanto o tamanho não muda (exigência do useSyncExternalStore)
function getSnapshot(): Viewport {
  const { innerWidth: width, innerHeight: height } = window;
  if (width !== cached.width || height !== cached.height) cached = { width, height };
  return cached;
}

export function useViewport(): Viewport {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_VIEWPORT);
}
