import { ScrollBootSequence } from '@/components/ui/ScrollBootSequence';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

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
      <nav className="fixed top-16 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] flex justify-between items-center glass-panel px-6 py-3 rounded-full max-w-3xl z-[100] shadow-2xl transition-all">
        <span className="font-geist-mono font-medium text-xs tracking-widest text-emerald-400">
          ERIK_PORTFOLIO
        </span>
        <div className="flex gap-4 text-xs font-semibold tracking-wider text-slate-300 uppercase">
          <Link href="/" locale="pt-BR" className="hover:text-white transition-colors">PT</Link>
          <span className="opacity-20">/</span>
          <Link href="/" locale="en" className="hover:text-white transition-colors">EN</Link>
        </div>
      </nav>

      {/* 400vh Scroll-Telling Sequence */}
      <ScrollBootSequence />
    </main>
  );
}
