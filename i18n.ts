import {defineConfig, getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // 動態載入 TS 模組，避免 JSON 解析問題
  const messages = (await import(`./messages/${locale}.ts`)).default;
  return {
    locale,
    messages
  };
});

export const locales = ['en', 'zh-Hant'] as const;
export const defaultLocale = 'zh-Hant';

export const routing = defineConfig({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

