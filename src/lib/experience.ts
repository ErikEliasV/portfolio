// Ordem dos cards de experiência (mais recente primeiro). Textos em Experience.<key>_*
export interface Job {
  key: string;
  icon: "plus" | "corner" | "cross";
  highlight?: boolean;
  freelance?: boolean;
}

export const EXPERIENCE: readonly Job[] = [
  { key: "graw", icon: "plus", highlight: true, freelance: true },
  { key: "i9", icon: "corner" },
  { key: "senac", icon: "cross" },
  { key: "claro", icon: "plus" },
];
