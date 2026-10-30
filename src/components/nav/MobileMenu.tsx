"use client";

import { useEffect, useId, useState } from "react";
import { NavLinks } from "./NavLinks";

// Menu compacto (abaixo de md): painel de largura total; fecha ao navegar e com Esc
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="border border-line bg-ink/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-fg"
      >
        {open ? "✕ MENU" : "MENU"}
      </button>
      {open && (
        <div id={panelId} className="fixed inset-x-0 top-14 z-[60] border-y border-line bg-ink/95 px-6 py-6">
          <NavLinks onNavigate={() => setOpen(false)} className="flex-col items-start gap-5 text-[13px]" />
        </div>
      )}
    </div>
  );
}
