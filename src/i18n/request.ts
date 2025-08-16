import {getRequestConfig} from 'next-intl/server';
import {hasLocale, IntlErrorCode} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // 讀對應語系訊息（找不到就退回預設 zh-Hant，避免 build 掛）
  let messages: Record<string, any>;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
  }

  return {
    locale,
    messages,
    // 生產環境放過「缺字串」錯誤，不影響部署
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
