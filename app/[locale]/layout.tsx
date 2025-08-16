// app/[locale]/layout.tsx
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import BottomNav from '@/components/BottomNav';

export function generateStaticParams() {
  // 讓 Next 在建置時預先產出所有語系的路徑
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // 語系不在設定內就 404
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // 告訴 next-intl 這次請求使用哪個語系（幫助 SSG/ISR）
  setRequestLocale(locale);

  // 從 i18n/request.ts 載入對應 messages（已在那邊處理 fallback）
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {/* 桌面側欄導航 */}
          <SideNav locale={locale} />
          {/* 主要內容區：為了側欄與手機底部導覽做內距 */}
          <main className="container py-4 md:pl-64 md:pt-6 pb-16">
            {children}
          </main>
          {/* 手機底部導覽 */}
          <BottomNav locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
