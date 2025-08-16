// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 排除 /api、/_next、/_vercel 與檔案請求，其餘都交給語系路由
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
