// Tamanho (px de tela) de um "pixel" do dither: ~70 pixels no diâmetro do planeta,
// com limites para não ficar fino demais nem grosso demais.
export function ditherPixelSize(planetDiameter: number, isMobile: boolean): number {
  const [min, max] = isMobile ? [3, 8] : [4, 12];
  return Math.min(max, Math.max(min, Math.round(planetDiameter / 70)));
}
