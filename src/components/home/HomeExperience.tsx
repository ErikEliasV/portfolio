"use client";

import { useRef } from "react";
import { MotionConfig, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { DitherBackground } from "@/components/dither/DitherBackground";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { BrowserBar } from "@/components/nav/BrowserBar";
import { SiteSections } from "@/components/sections/SiteSections";
import { getIntroState } from "@/lib/intro/timeline";
import { useMediaQuery } from "@/lib/use-media-query";
import { useViewport } from "@/lib/use-viewport";

export function HomeExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Saltos grandes (F5 no meio da página, link direto para uma seção) não animam a intro
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (Math.abs(value - progress.get()) > 0.5) progress.jump(value);
  });

  const isMobile = useMediaQuery("(max-width: 767px)");
  const viewport = useViewport();
  const browserBar = useTransform(progress, (p) => getIntroState(p, viewport, isMobile).browserBar);

  return (
    <MotionConfig reducedMotion="user">
      <DitherBackground introProgress={progress} />
      <BrowserBar visible={browserBar} />
      <main>
        <IntroSequence containerRef={ref} progress={progress} />
        {/* As seções sobem pela última meia tela da intro: aparecem enquanto o terminal some */}
        <div className="-mt-[50vh]">
          <SiteSections />
        </div>
      </main>
    </MotionConfig>
  );
}
