// A 404 global fica fora do segmento [locale]: o idioma vem do próprio endereço.
const LOCALES = ["pt-BR", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function stripBasePath(pathname: string, basePath: string): string {
  if (!basePath || !pathname.startsWith(basePath)) return pathname;
  return pathname.slice(basePath.length) || "/";
}

// Raiz do site, com ou sem o base path: no dev ela cai na 404 global (no Pages o out/index.html redireciona)
export function isSiteRoot(pathname: string, basePath: string): boolean {
  return stripBasePath(pathname, basePath).replace(/\/+$/, "") === "";
}

export function localeFromPath(pathname: string, basePath: string): Locale {
  const first = stripBasePath(pathname, basePath).split("/")[1];
  return LOCALES.find((locale) => locale === first) ?? "pt-BR";
}
