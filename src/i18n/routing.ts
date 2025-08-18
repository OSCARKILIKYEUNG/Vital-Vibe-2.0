// src/i18n/routing.ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh-Hant'],
  defaultLocale: 'zh-Hant',
  // 兩語系都帶前綴，像 /en /zh-Hant
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/auth/sign-in': '/auth/sign-in',
    '/profile': '/profile',
    '/log/meal': '/log/meal',
    '/log/workout': '/log/workout',
    '/library/videos': '/library/videos',
    '/library/recipes': '/library/recipes'
  }
});
