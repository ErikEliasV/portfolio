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

// A prévia do link (og:image) precisa de endereço absoluto
const SITE_URL = "https://erikeliasv.github.io";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Erik Elias",
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
      title,
      description,
      images: [{ url: `${basePath}/og/${locale}.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image" },
  };
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
