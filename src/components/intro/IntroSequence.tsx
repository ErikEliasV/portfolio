"use client";

import { useState, type CSSProperties, type RefObject } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { getIntroState, INTRO_SCROLL_VH } from "@/lib/intro/timeline";
import { useMediaQuery } from "@/lib/use-media-query";
import { useViewport } from "@/lib/use-viewport";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { NavLinks } from "@/components/nav/NavLinks";
import { BootTerminal } from "./BootTerminal";
import { HeroCards } from "./HeroCards";

// Altura da intro em CSS (estável no SSR): 200vh no celular, 400vh no desktop
const CONTAINER_HEIGHT = {
  "--intro-mobile": `${INTRO_SCROLL_VH.mobile}vh`,
  "--intro-desktop": `${INTRO_SCROLL_VH.desktop}vh`,
} as CSSProperties;

export function IntroSequence({
  containerRef,
  progress,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
}) {
  const t = useTranslations("Hero");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const viewport = useViewport();

  const state = useTransform(progress, (p) => getIntroState(p, viewport, isMobile));
  const heroOpacity = useTransform(state, (s) => s.heroOpacity);
  // Invisível = fora da ordem do Tab
  const heroVisibility = useTransform(heroOpacity, (o) => (o > 0 ? "visible" : "hidden"));
  const top = useTransform(state, (s) => s.terminal.top);
  const right = useTransform(state, (s) => s.terminal.right);
  const bottom = useTransform(state, (s) => s.terminal.bottom);
  const left = useTransform(state, (s) => s.terminal.left);
  const borderRadius = useTransform(state, (s) => s.terminal.radius);
  const terminalOpacity = useTransform(state, (s) => 1 - s.browserBar);
  const terminalVisibility = useTransform(terminalOpacity, (o) => (o > 0 ? "visible" : "hidden"));

  // Único estado React por quadro: só muda quando uma linha nova é "digitada"
  const [typedLines, setTypedLines] = useState(() => getIntroState(progress.get(), viewport, isMobile).typedLines);
  useMotionValueEvent(progress, "change", (p) => setTypedLines(getIntroState(p, viewport, isMobile).typedLines));

  const [firstName, ...rest] = t("title").split(" ");
  const hero = { opacity: heroOpacity, visibility: heroVisibility };

  return (
    <div ref={containerRef} id="top" style={CONTAINER_HEIGHT} className="relative h-(--intro-mobile) md:h-(--intro-desktop)">
      {/* Fica acima das seções que sobem por baixo no fim; só os filhos interativos recebem clique */}
      <div className="pointer-events-none sticky top-0 z-10 h-[100dvh] overflow-hidden">
        {/* Barra do topo */}
        <motion.div
          style={hero}
          className="pointer-events-auto absolute inset-x-6 top-5 z-20 flex items-center justify-between gap-6 border-t border-accent-dim pt-3 md:inset-x-9"
        >
          <span className="bg-ink/90 px-2 py-1.5 text-[11px] uppercase tracking-[0.12em] text-fg">
            ERIK ELIAS
            <span className="ml-2 text-accent" aria-hidden="true">
              ✕✕✕
            </span>
          </span>
          {/* Placa escura: o planeta passa por trás do menu */}
          <NavLinks className="hidden bg-ink/90 px-3 py-1.5 md:flex" />
          <MobileMenu />
        </motion.div>

        {/* Nome, cargo e CTA */}
        <motion.div
          style={hero}
          className="pointer-events-auto absolute inset-x-6 top-[13vh] z-10 md:left-9 md:right-auto md:top-[17vh] md:max-w-[52vw]"
        >
          <p className="flex w-fit items-center gap-2 bg-ink/90 px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-muted">
            <span className="size-2 flex-none animate-pulse bg-accent" aria-hidden="true" />
            {t("role")}
          </p>
          <h1 className="mt-4 font-pixel text-[clamp(44px,7.2vw,120px)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-cream text-outline [overflow-wrap:anywhere]">
            {firstName}
            <br />
            {rest.join(" ")}/
          </h1>
          <div className="mt-5 w-fit max-w-[46ch] bg-ink/90 px-2 py-1.5">
            <p className="text-[12px] uppercase tracking-[0.06em] text-muted">{t("heroRole")}</p>
            <p className="mt-1 text-[11px] uppercase leading-[1.55] tracking-[0.06em] text-copy md:text-[12px]">
              {t("subtitle")}
            </p>
          </div>
          <a href="#projects" className="mt-6 inline-block font-pixel text-[clamp(18px,1.9vw,28px)] uppercase text-accent text-outline">
            {`{${t("cta")}}`}
          </a>
        </motion.div>

        {/* Cards de seção (só desktop) */}
        <motion.div style={hero} className="pointer-events-auto absolute inset-x-6 bottom-6 z-10 md:inset-x-9">
          <HeroCards />
        </motion.div>

        {/* Terminal: do canto do hero ao centro, depois tela cheia */}
        <motion.div
          style={{ top, right, bottom, left, borderRadius, opacity: terminalOpacity, visibility: terminalVisibility }}
          className="absolute z-30 flex flex-col overflow-hidden border border-line bg-panel/95 shadow-[0_0_60px_#000a]"
        >
          <div className="flex h-10 flex-none items-center gap-[7px] border-b border-line px-4">
            <span className="size-2.5 bg-accent" />
            <span className="size-2.5 bg-line" />
            <span className="size-2.5 bg-line" />
            <span className="ml-auto text-[10px] tracking-[0.1em] text-muted">ERIK@LOCAL</span>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden px-5 py-4">
            <BootTerminal typedLines={typedLines} mobile={isMobile} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
