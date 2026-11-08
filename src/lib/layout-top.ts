interface OffsetNode {
  offsetTop: number;
  offsetParent: unknown;
}

// Posição vertical do elemento no documento pelo layout. Diferente de
// getBoundingClientRect, ignora transforms (o fim da intro desloca as seções).
export function layoutTop(element: OffsetNode): number {
  let top = 0;
  for (let node: OffsetNode | null = element; node; node = node.offsetParent as OffsetNode | null) {
    top += node.offsetTop;
  }
  return top;
}
