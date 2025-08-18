'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

export default function Header() {
  const t = useTranslations('Common');
  const tNav = useTranslations('Nav');
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b bg-white/80 backdrop-blur-md dark:bg-neutral-900/70">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 簡單字母 Logo */}
          <div className="h-8 w-8 rounded-xl bg-black/90 dark:bg-white/90 text-white dark:text-black grid place-items-center text-sm font-bold">
            VV
          </div>
          <span className="font-semibold tracking-wide">{t('appName')}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:opacity-80">{tNav('dashboard')}</Link>
          <Link href="/log/meal" className="hover:opacity-80">{tNav('logMeal')}</Link>
          <Link href="/log/workout" className="hover:opacity-80">{tNav('logWorkout')}</Link>
          <Link href="/library/videos" className="hover:opacity-80">{tNav('library')}</Link>
          <Link href="/profile" className="hover:opacity-80">{tNav('profile')}</Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* 語言切換 */}
          <Link
            href={pathname}
            locale="zh-Hant"
            className="px-2 py-1 rounded-md text-xs border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            aria-label="切換為繁中"
          >
            繁中
          </Link>
          <Link
            href={pathname}
            locale="en"
            className="px-2 py-1 rounded-md text-xs border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            aria-label="Switch to English"
          >
            EN
          </Link>

          {/* 登入入口（先靜態連結） */}
          <Link
            href="/auth/sign-in"
            className="ml-2 px-3 py-1.5 rounded-lg text-xs border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            {tNav('signIn')}
          </Link>
        </div>
      </div>
    </header>
  );
}
