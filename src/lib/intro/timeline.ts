// Estado da intro (hero → terminal → mergulho no cursor → tela verde que se desfaz
// em pixels → site) em função do progresso do scroll. Quem chama suaviza com useSpring.

export const INTRO_SCROLL_VH = { desktop: 400, mobile: 200 } as const;
// Pausa no fim da intro: o site já revelado fica parado por mais este tanto de scroll
export const INTRO_HOLD_VH = { desktop: 60, mobile: 40 } as const;
export const BOOT_LINES = { desktop: 8, mobile: 4 } as const;

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
} // px a partir das bordas da viewport

export interface IntroState {
  heroOpacity: number; // 0..1
  typedLines: number; // inteiro 1..BOOT_LINES
  planet: { x: number; y: number; radius: number; opacity: number }; // x,y em fração da viewport; radius em fração da ALTURA
  terminal: Insets & { radius: number }; // radius em px
  zoom: number; // 0..1, com easing: mergulho da câmera no cursor
  cover: number; // 0..1: fração da tela ainda coberta de verde
  site: boolean; // tela verde cheia: terminal some, site fica montado por baixo
  browserBar: number; // 0..1
  done: boolean; // browserBar === 1
}

// Marcos da transição terminal → site
const TERMINAL_FULL_AT = 0.72;
const COVER_AT = 0.84; // fim do zoom: o cursor cobre a tela
const DISSOLVE_FROM = 0.88;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
// Progresso local de p dentro de [a, b], limitado a 0..1
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

// Progresso da animação a partir do scroll da intro inteira (que inclui a pausa no fim):
// a animação ocupa só o trecho antes da pausa e fica em 1 durante ela.
export function introProgress(scrollProgress: number, isMobile: boolean): number {
  const mode = isMobile ? "mobile" : "desktop";
  const animation = INTRO_SCROLL_VH[mode] - 100; // a última tela é a do sticky
  return clamp((scrollProgress * (animation + INTRO_HOLD_VH[mode])) / animation);
}

// Deslocamento (px) que mantém o site parado no lugar enquanto a intro ainda rola.
// rawProgress é o scroll real (sem spring); range é o quanto a intro rola em px.
export function pinnedSiteOffset(rawProgress: number, range: number): number {
  return rawProgress >= 1 ? 0 : -(1 - rawProgress) * range;
}

// Insets em fração: top/bottom da altura, left/right da largura
const TERMINAL_HERO = {
  desktop: { top: 0.38, right: 0.06, bottom: 0.3, left: 0.6 },
  mobile: { top: 0.58, right: 0.05, bottom: 0.08, left: 0.05 },
};
const TERMINAL_CENTER = {
  desktop: { top: 0.18, right: 0.16, bottom: 0.18, left: 0.16 },
  mobile: { top: 0.2, right: 0.05, bottom: 0.2, left: 0.05 },
};
const TERMINAL_FULL = { top: 0, right: 0, bottom: 0, left: 0 };

const PLANET_START = {
  desktop: { x: 0.72, y: 0.42, radius: 0.55 },
  mobile: { x: 0.5, y: 0.3, radius: 0.4 },
};
const PLANET_END = { x: 0.5, y: -0.1, radius: 0.2 };

export function getIntroState(
  progress: number,
  viewport: { width: number; height: number },
  isMobile: boolean,
): IntroState {
  const p = clamp(progress);
  const mode = isMobile ? "mobile" : "desktop";
  const { width: w, height: h } = viewport;

  const lines = BOOT_LINES[mode];
  const typedLines = 1 + Math.floor((lines - 1) * clamp(p / 0.55));

  const start = PLANET_START[mode];
  const tp = seg(p, 0.15, 0.6);
  const planet = {
    x: lerp(start.x, PLANET_END.x, tp),
    y: lerp(start.y, PLANET_END.y, tp),
    radius: lerp(start.radius, PLANET_END.radius, tp),
    opacity: 1 - seg(p, 0.5, 0.6),
  };

  const [from, to, t] =
    p <= 0.4
      ? [TERMINAL_HERO[mode], TERMINAL_CENTER[mode], seg(p, 0.15, 0.4)]
      : [TERMINAL_CENTER[mode], TERMINAL_FULL, seg(p, 0.55, TERMINAL_FULL_AT)];
  const terminal = {
    top: lerp(from.top, to.top, t) * h,
    right: lerp(from.right, to.right, t) * w,
    bottom: lerp(from.bottom, to.bottom, t) * h,
    left: lerp(from.left, to.left, t) * w,
    radius: 12 * (1 - seg(p, 0.55, TERMINAL_FULL_AT)),
  };

  const site = p >= COVER_AT;
  // A barra entra escondida sob o verde, então aparece pronta quando os pixels somem
  const browserBar = seg(p, COVER_AT, COVER_AT + 0.02);

  return {
    heroOpacity: 1 - seg(p, 0.05, 0.35),
    typedLines,
    planet,
    terminal,
    zoom: smoothstep(seg(p, TERMINAL_FULL_AT, COVER_AT)),
    cover: site ? 1 - seg(p, DISSOLVE_FROM, 1) : 0,
    site,
    browserBar,
    done: browserBar === 1,
  };
}
