import { setRequestLocale } from 'next-intl/server';
import { SiteSections } from '@/components/sections/SiteSections';
import { DitherBackground } from '@/components/dither/DitherBackground';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-[100dvh]">
      <DitherBackground />
      <SiteSections />
    </main>
  );
}
