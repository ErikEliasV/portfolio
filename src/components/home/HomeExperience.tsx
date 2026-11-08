"use client";

import { useRef } from "react";
import {
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { DitherBackground } from "@/components/dither/DitherBackground";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { PixelCover } from "@/components/intro/PixelCover";
import { BrowserBar } from "@/components/nav/BrowserBar";
import { SiteSections } from "@/components/sections/SiteSections";
import { getIntroState, introProgress, pinnedSiteOffset } from "@/lib/intro/timeline";
import { useMediaQuery } from "@/lib/use-media-query";
import { useViewport } from "@/lib/use-viewport";

export function HomeExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const viewport = useViewport();
  // scrollYProgress cobre a intro inteira; a animação acaba antes, na pausa do fim
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const animation = useTransform(scrollYProgress, (v) => introProgress(v, isMobile));
  const progress = useSpring(animation, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Saltos grandes (F5 no meio da página, link direto para uma seção) não animam a intro
  useMotionValueEvent(animation, "change", (value) => {
    if (Math.abs(value - progress.get()) > 0.5) progress.jump(value);
  });

  const reduced = useReducedMotion();
  const browserBar = useTransform(progress, (p) => getIntroState(p, viewport, isMobile).browserBar);

  // O site só aparece com a tela verde cheia e fica parado no lugar até a intro acabar de
  // rolar: quando os pixels somem, ele já está ali. Fora disso, sem transform (âncoras certas).
  // Dependências explícitas: o scroll real (posição) e o com spring (quando aparece)
  const siteVisibility = useTransform(progress, (p) => (getIntroState(p, viewport, isMobile).site ? "visible" : "hidden"));
  const siteY = useTransform([scrollYProgress, progress], ([raw, p]: number[]) => {
    const intro = ref.current;
    if (!intro || !getIntroState(p, viewport, isMobile).site) return 0;
    return pinnedSiteOffset(raw, intro.offsetHeight - viewport.height);
  });

  return (
    <MotionConfig reducedMotion="user">
      <DitherBackground introProgress={progress} />
      <BrowserBar visible={browserBar} />
      {!reduced && <PixelCover progress={progress} />}
      <main>
        <IntroSequence containerRef={ref} progress={progress} />
        {/* Sobrepõe a última tela da intro: no fim dela, a primeira seção já está no topo
            (abaixo da barra, onde um clique no menu a deixaria) */}
        <motion.div style={{ y: siteY, visibility: siteVisibility }} className="-mt-[calc(100dvh-5rem)]">
          <SiteSections />
        </motion.div>
      </main>
    </MotionConfig>
  );
}
