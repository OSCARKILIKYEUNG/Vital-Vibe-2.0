// src/i18n/routing.ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // 你的語言清單
  locales: ['en', 'zh-Hant'],
  // 預設語言
  defaultLocale: 'en'
});
