import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有非 /api、/_next、/_vercel、檔案請求
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
