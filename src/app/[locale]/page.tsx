import { setRequestLocale } from 'next-intl/server';
import { HomeExperience } from '@/components/home/HomeExperience';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeExperience />;
}
