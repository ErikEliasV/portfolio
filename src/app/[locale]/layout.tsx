import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import { MouseFollower } from '@/components/ui/MouseFollower';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-BR' }];
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Erik - Front-End Engineer",
  description: "Portfolio built with Next.js and Premium UI/UX",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] bg-[#09090b] text-slate-200 tracking-tight`}
      >
        <NextIntlClientProvider messages={messages}>
          <MouseFollower />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
