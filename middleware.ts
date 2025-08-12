import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'zh-Hant'],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'zh-Hant'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}