"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { layoutTop } from "@/lib/layout-top";
import { SCROLL_LOCK_EVENT, SCROLL_UNLOCK_EVENT } from "@/lib/scroll-lock";

// Rolagem suave com Lenis. Com movimento reduzido, fica a rolagem nativa.
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const firstPath = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onAnchorClick = (event: MouseEvent) => {
      const lenis = lenisRef.current;
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
      // Respeita o scroll-margin-top da seção (barra fixa no topo). Posição pelo layout:
      // no fim da intro as seções estão deslocadas por transform.
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lenis.scrollTo(layoutTop(target) - margin);
      history.pushState(null, "", hash);
    };

    const onPopState = () => {
      fromHistory.current = true;
    };

    const start = () => {
      if (lenisRef.current || reduced.matches) return;
      lenisRef.current = new Lenis({ autoRaf: true, lerp: 0.1 });
    };
    const stop = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    const onMotionChange = () => (reduced.matches ? stop() : start());
    // Modal aberto: a página de trás não rola
    const onLock = () => lenisRef.current?.stop();
    const onUnlock = () => lenisRef.current?.start();

    start();
    reduced.addEventListener("change", onMotionChange);
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("popstate", onPopState);
    window.addEventListener(SCROLL_LOCK_EVENT, onLock);
    window.addEventListener(SCROLL_UNLOCK_EVENT, onUnlock);
    return () => {
      reduced.removeEventListener("change", onMotionChange);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener(SCROLL_LOCK_EVENT, onLock);
      window.removeEventListener(SCROLL_UNLOCK_EVENT, onUnlock);
      stop();
    };
  }, []);

  // Página nova abre no topo: corta a rolagem suave que vinha da página anterior.
  // No voltar/avançar do navegador, só para a animação e deixa o Next restaurar a posição.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    const lenis = lenisRef.current;
    if (fromHistory.current || location.hash) {
      fromHistory.current = false;
      // stop + start zera a animação em curso (reset é privado no Lenis)
      lenis?.stop();
      lenis?.start();
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
