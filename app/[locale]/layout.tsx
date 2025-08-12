import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh-Hant' }]
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`../../messages/${params.locale}.json`)).default
  } catch (error) {
    notFound()
  }
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Header />
          <main className="container py-4 md:pt-6 pb-16">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}