// Matriz Bayer recursiva: M(2n) = [[4M, 4M+2], [4M+3, 4M+1]] a partir de M(1) = [0].
function bayerMatrix(size: number): number[][] {
  let m = [[0]];
  while (m.length < size) {
    const n = m.length;
    const next: number[][] = Array.from({ length: n * 2 }, () => new Array<number>(n * 2));
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = 4 * m[y][x];
        next[y][x] = v;
        next[y][x + n] = v + 2;
        next[y + n][x] = v + 3;
        next[y + n][x + n] = v + 1;
      }
    }
    m = next;
  }
  return m;
}

// 64 limiares row-major do 8×8, cada um (rank + 0.5) / 64.
export function bayerThresholds(): number[] {
  return bayerMatrix(8).flat().map((rank) => (rank + 0.5) / 64);
}
