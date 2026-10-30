export const WAVE_PALETTE: readonly string[] = ["#0d0d0d", "#151d0e", "#34501b", "#b5f562"];

// Valores iniciais; a sintonia fina é feita olhando o resultado.
export const PLANET_PALETTE = {
  oceanDeep: "#12233a",
  oceanMid: "#1f5f8c",
  shallows: "#3fb5b0",
  landDark: "#2f6b2f",
  landMid: "#4f9a3c",
  landLight: "#a8d65a",
  cloud: "#efe6c8",
  rim: "#e8dcb5",
} as const;

export function hexToRgb01(hex: string): [number, number, number] {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Invalid hex color: ${hex}`);
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
