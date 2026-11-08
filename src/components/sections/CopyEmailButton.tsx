"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FiCheck, FiCopy } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { CONTACT_EMAIL } from "@/lib/contact";

// Copia o email com um clique; sem acesso à área de transferência, abre o app de email
export function CopyEmailButton({ className }: { className?: string }) {
  const t = useTranslations("Sections.contact.form");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const Icon = copied ? FiCheck : FiCopy;

  return (
    <button
      type="button"
      onClick={copy}
      className={twMerge(
        "group flex w-fit max-w-full items-center gap-2.5 border border-line bg-panel/95 px-3 py-2 text-left text-[12px] text-fg transition-colors hover:border-accent-dim",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 flex-none text-accent" />
      <span className="[overflow-wrap:anywhere]">{CONTACT_EMAIL}</span>
      <span aria-live="polite" className="ml-1 flex-none text-[10px] uppercase tracking-[0.12em] text-muted group-hover:text-accent">
        {copied ? t("copied") : t("copyEmail")}
      </span>
    </button>
  );
}
