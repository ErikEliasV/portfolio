// Tela verde que se desfaz em pixels no fim da intro. Cada célula é um múltiplo
// do pixel do dither do fundo, então as duas grades ficam alinhadas.
export const COVER_CELL_SCALE = 4;

// Limiar fixo por célula em [0, 1): a célula fica verde enquanto limiar < cover.
// Hash inteiro (sem Math.random) para a mesma ordem ao rolar para trás.
export function cellThreshold(x: number, y: number): number {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// Pinta um ImageData de cols × rows (1 px por célula) com a fração `cover` ainda verde
export function paintCover(
  data: Uint8ClampedArray,
  cols: number,
  rows: number,
  cover: number,
  [r, g, b]: readonly number[],
): void {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = cellThreshold(x, y) < cover ? 255 : 0;
    }
  }
}
