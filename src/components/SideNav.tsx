'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

function Item({
  href,
  label,
  active
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
        active
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'hover:bg-black/5 dark:hover:bg-white/10'
      ].join(' ')}
    >
      {/* 內建簡單 SVG icon（避免外部套件） */}
      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}

export default function SideNav({locale}: {locale?: string}) {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  // 判斷 active
  const isActive = (p: string) =>
    pathname === p ||
    (p !== '/' && pathname.startsWith(p));

  return (
    <aside className="hidden md:block fixed top-14 left-0 bottom-0 w-56 border-r bg-white/70 dark:bg-neutral-900/50 backdrop-blur">
      <div className="p-3 flex flex-col gap-2">
        <Item href="/" label={t('dashboard')} active={isActive('/')} />
        <Item href="/log/meal" label={t('logMeal')} active={isActive('/log/meal')} />
        <Item href="/log/workout" label={t('logWorkout')} active={isActive('/log/workout')} />
        <Item href="/library/videos" label={t('library')} active={isActive('/library')} />
        <Item href="/profile" label={t('profile')} active={isActive('/profile')} />
      </div>
    </aside>
  );
}
