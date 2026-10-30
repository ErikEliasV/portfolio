import type { Metadata } from "next";
import "../globals.css";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import { MouseFollower } from '@/components/ui/MouseFollower';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { geistMono, silkscreen } from '../fonts';

// Idioma fora da lista vira 404 (igual ao site publicado)
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-BR' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    // As variáveis das fontes ficam no <html>: o @theme do Tailwind as lê no :root
    <html lang={locale} className={`dark ${geistMono.variable} ${silkscreen.variable}`}>
      <body className="font-mono antialiased bg-ink text-fg min-h-[100dvh]">
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <MouseFollower />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
