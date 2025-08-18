// app/[locale]/layout.tsx
import '../globals.css'; // ← 修正路徑（上一層）
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import BottomNav from '@/components/BottomNav';

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const {locale} = params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex bg-background text-foreground">
        <SideNav className="hidden md:block" />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 max-w-[1200px] w-full mx-auto">
            <NextIntlClientProvider messages={messages} locale={locale}>
              {children}
            </NextIntlClientProvider>
          </main>
          <BottomNav className="md:hidden" />
        </div>
      </body>
    </html>
  );
}
