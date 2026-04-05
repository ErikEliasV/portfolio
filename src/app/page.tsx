'use client';

import { useEffect } from 'react';
import { routing } from '@/i18n/routing';

export default function RootPage() {
  useEffect(() => {
    window.location.replace(`/${routing.defaultLocale}`);
  }, []);

  return null;
}
