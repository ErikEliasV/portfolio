"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Rolagem suave com Lenis. Com movimento reduzido, fica a rolagem nativa.
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const onAnchorClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href^='#']");
      const hash = anchor?.getAttribute("href");
      if (!hash) return;

      if (hash === "#" || hash === "#top") {
        event.preventDefault();
        lenis.scrollTo(0);
        history.pushState(null, "", hash === "#" ? location.pathname : hash);
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      // Respeita o scroll-margin-top da seção (barra fixa no topo)
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lenis.scrollTo(target, { offset: -margin });
      history.pushState(null, "", hash);
    };

    const start = () => {
      if (lenis || reduced.matches) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
    };
    const onMotionChange = () => (reduced.matches ? stop() : start());

    start();
    reduced.addEventListener("change", onMotionChange);
    document.addEventListener("click", onAnchorClick);
    return () => {
      reduced.removeEventListener("change", onMotionChange);
      document.removeEventListener("click", onAnchorClick);
      stop();
    };
  }, []);

  return null;
}
