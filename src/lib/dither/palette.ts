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

const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");

// Mistura linear de duas cores; t = 0 dá `a`, t = 1 dá `b`
export function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb01(a);
  const cb = hexToRgb01(b);
  return `#${ca.map((v, i) => toHex(v + (cb[i] - v) * t)).join("")}`;
}

// Ondas tingidas com a cor de um projeto: fundo, dois tons escuros e a crista na cor pura
export function wavePalette(accent: string): string[] {
  const ink = WAVE_PALETTE[0];
  const color = accent.toLowerCase();
  return [ink, mixHex(ink, color, 0.12), mixHex(ink, color, 0.34), color];
}
