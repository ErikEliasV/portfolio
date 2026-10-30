"use client";

import { useLocale, useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { Link } from "@/i18n/routing";
import { SECTIONS } from "@/lib/sections";

const LOCALES = [
  { locale: "pt-BR", label: "PT" },
  { locale: "en", label: "EN" },
] as const;

export function NavLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const t = useTranslations("Nav");
  const current = useLocale();
  const item = "text-muted transition-colors hover:text-fg";

  return (
    <nav className={twMerge("flex items-center gap-[clamp(12px,1.5vw,22px)] text-[11px] uppercase tracking-[0.12em]", className)}>
      <a href="#top" onClick={onNavigate} className={item}>
        {t("about")}
      </a>
      {SECTIONS.map(({ id }) => (
        <a key={id} href={`#${id}`} onClick={onNavigate} className={item}>
          {t(id)}
        </a>
      ))}
      <span className="flex items-center gap-1.5 text-muted">
        {LOCALES.map(({ locale, label }, i) => (
          <span key={locale} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            <Link
              href="/"
              locale={locale}
              onClick={onNavigate}
              aria-current={locale === current ? "true" : undefined}
              className={locale === current ? "text-accent" : item}
            >
              {label}
            </Link>
          </span>
        ))}
      </span>
    </nav>
  );
}
