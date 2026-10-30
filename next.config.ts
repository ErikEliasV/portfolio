import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/portfolio",
  images: {
    unoptimized: true,
  },
  // 404 própria para endereços sem rota (o layout raiz é o [locale], dinâmico)
  experimental: {
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
