// Projetos podem ter vídeos no lugar de capturas de tela
export function isVideo(src: string): boolean {
  return /\.(mp4|webm)$/i.test(src);
}
