'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

function Btn({
  href,
  label,
  active,
  icon
}: {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs transition',
        active
          ? 'text-black dark:text-white'
          : 'text-neutral-500 hover:text-black dark:hover:text-white'
      ].join(' ')}
    >
      <div className={[
        'h-8 w-8 grid place-items-center rounded-xl border',
        active ? 'bg-black text-white dark:bg-white dark:text-black' : ''
      ].join(' ')}>
        {icon ?? (
          <svg width="16" height="16" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" />
          </svg>
        )}
      </div>
      <span className="leading-none">{label}</span>
    </Link>
  );
}

export default function BottomNav({locale}: {locale?: string}) {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  const isActive = (p: string) =>
    pathname === p ||
    (p !== '/' && pathname.startsWith(p));

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 border-t bg-white/90 dark:bg-neutral-900/80 backdrop-blur z-40">
      <div className="mx-auto max-w-3xl px-2 py-2 grid grid-cols-5 gap-1">
        <Btn href="/" label={t('dashboard')} active={isActive('/')} />
        <Btn href="/log/meal" label={t('logMeal')} active={isActive('/log/meal')} />
        <Btn href="/log/workout" label={t('logWorkout')} active={isActive('/log/workout')} />
        <Btn href="/library/videos" label={t('library')} active={isActive('/library')} />
        <Btn href="/profile" label={t('profile')} active={isActive('/profile')} />
      </div>
    </nav>
  );
}
