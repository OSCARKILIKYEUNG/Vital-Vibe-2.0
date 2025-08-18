// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// 指向我們的 i18n request 設定檔（放在 src/i18n/request.ts）
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  }
};

export default withNextIntl(nextConfig);
