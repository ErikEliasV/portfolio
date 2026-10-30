"use client";

import { useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DitherBackground } from "@/components/dither/DitherBackground";
import { stripBasePath } from "@/lib/locale-from-path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const subscribe = () => () => {};

export function NotFoundView() {
  const t = useTranslations("NotFound");
  const locale = useLocale();
  // O endereço só existe no cliente (a 404 é um HTML estático)
  const path = useSyncExternalStore(
    subscribe,
    () => stripBasePath(window.location.pathname, basePath),
    () => "/",
  );

  return (
    <>
      <DitherBackground />
      <main className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col justify-center px-6 py-24 md:px-9">
        <div className="w-fit max-w-full bg-ink/90 px-2 py-1.5 text-[12px] leading-[1.7] [overflow-wrap:anywhere]">
          <p className="text-muted">
            <span className="text-accent">erik@local</span> ~/portfolio $ cd {path}
          </p>
          <p className="text-copy">bash: cd: {path}: No such file or directory</p>
        </div>
        <h1 className="mt-6 font-pixel text-[clamp(72px,22vw,280px)] font-bold leading-[0.85] tracking-[-0.03em] text-cream text-outline">
          404/
        </h1>
        <div className="mt-6 w-fit max-w-[46ch] bg-ink/90 px-3 py-2">
          <p className="text-[12px] uppercase tracking-[0.1em] text-fg">
            {t("title")}
            <span className="ml-2 text-accent" aria-hidden="true">
              ✕✕✕
            </span>
          </p>
          <p className="mt-1 text-[13px] leading-[1.6] text-copy">{t("message")}</p>
        </div>
        <a
          href={`${basePath}/${locale}`}
          className="mt-8 w-fit font-pixel text-[clamp(18px,2vw,28px)] uppercase text-accent text-outline"
        >
          {`{${t("cta")}}`}
        </a>
      </main>
    </>
  );
}
