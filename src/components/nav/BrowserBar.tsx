"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

// Barra de navegador fixa: é no que o topo do terminal se transforma no fim da intro
export function BrowserBar({ visible, showBack = false }: { visible: MotionValue<number> | number; showBack?: boolean }) {
  const t = useTranslations("Projects");
  const fixed = useMotionValue(typeof visible === "number" ? visible : 1);
  const opacity = typeof visible === "number" ? fixed : visible;
  const pointerEvents = useTransform(opacity, (v) => (v < 1 ? "none" : "auto"));
  // Invisível = fora da ordem do Tab
  const visibility = useTransform(opacity, (v) => (v > 0 ? "visible" : "hidden"));

  useEffect(() => {
    if (typeof visible === "number") fixed.set(visible);
  }, [visible, fixed]);

  return (
    <motion.header
      style={{ opacity, pointerEvents, visibility }}
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-4 border-b border-line bg-ink/90 px-5 backdrop-blur"
    >
      <div className="flex flex-none gap-[7px]" aria-hidden="true">
        <span className="size-2.5 bg-accent" />
        <span className="size-2.5 bg-line" />
        <span className="size-2.5 bg-line" />
      </div>
      <span className="truncate rounded-full border border-line px-4 py-1 text-[11.5px] text-fg">🔒 localhost:3000</span>
      <div className="ml-auto flex-none">
        {showBack ? (
          <Link href="/" className="text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent">
            ← {t("back")}
          </Link>
        ) : (
          <>
            <NavLinks className="hidden md:flex" />
            <MobileMenu />
          </>
        )}
      </div>
    </motion.header>
  );
}
