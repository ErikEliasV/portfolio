// Pausa a rolagem suave (Lenis) enquanto um modal está aberto. O SmoothScroll escuta.
export const SCROLL_LOCK_EVENT = "portfolio:scroll-lock";
export const SCROLL_UNLOCK_EVENT = "portfolio:scroll-unlock";

export const lockScroll = () => window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
export const unlockScroll = () => window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
