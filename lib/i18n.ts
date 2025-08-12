import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}))

export const locales = ['en', 'zh-Hant'] as const
export type AppLocale = typeof locales[number]