import { ScrollBootSequence } from '@/components/ui/ScrollBootSequence';
import { Header } from '@/components/ui/Header';
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="flex flex-col bg-[#0c0c10] min-h-[100dvh]">
      {/* Dynamic Nav Pill - Remains always at top z-50 */}
      <Header />

      {/* 400vh Scroll-Telling Sequence */}
      <ScrollBootSequence />
    </main>
  );
}
