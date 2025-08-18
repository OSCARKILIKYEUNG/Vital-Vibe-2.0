// src/i18n/request.ts
// 提供 Server Components 在請求期間取得 messages 的設定（與根目錄 i18n.ts 互補）
import {getRequestConfig} from 'next-intl/server';
import {hasLocale, IntlErrorCode} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? (requested as string)
    : routing.defaultLocale;

  let messages: Record<string, any>;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
  }

  return {
    locale,
    messages,
    onError(error) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE) {
        console.error(error);
      }
    },
    getMessageFallback({namespace, key}) {
      return [namespace, key].filter(Boolean).join('.');
    }
  };
});
