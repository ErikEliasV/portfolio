// Limita o loop de requestAnimationFrame a `maxFps` (com 1ms de folga).
export function shouldRenderFrame(now: number, last: number, maxFps: number): boolean {
  return now - last >= 1000 / maxFps - 1;
}
