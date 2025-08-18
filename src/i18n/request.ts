// src/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Next 14/15 相容寫法：requestLocale 需要 await，且可能是 undefined
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // 依目前 locale 載入對應 messages（檔案放在 /messages）
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
