"use client";

import { useEffect, useSyncExternalStore } from "react";
import { NextIntlClientProvider } from "next-intl";
import { localeFromPath, type Locale } from "@/lib/locale-from-path";
import ptBR from "../../../messages/pt-BR.json";
import en from "../../../messages/en.json";
import { NotFoundView } from "./NotFoundView";

const MESSAGES = { "pt-BR": ptBR, en };
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const subscribe = () => () => {};

// A 404 global não passa pelo layout de [locale]: o idioma sai do endereço (/portfolio/en/... é inglês)
export function GlobalNotFoundClient() {
  const locale = useSyncExternalStore<Locale>(
    subscribe,
    () => localeFromPath(window.location.pathname, basePath),
    () => "pt-BR",
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]} timeZone="America/Sao_Paulo">
      <NotFoundView />
    </NextIntlClientProvider>
  );
}
