import createNextIntlPlugin from 'next-intl/plugin';

// 預設會找 ./i18n/request.(ts|js)，我們就用預設即可
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false
};

export default withNextIntl(nextConfig);
