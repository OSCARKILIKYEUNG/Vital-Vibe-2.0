// src/i18n/navigation.ts
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// 匯出 Link / useRouter / usePathname… 供 Header / SideNav 使用
export const {
  Link,
  usePathname,
  useRouter,
  getPathname
} = createSharedPathnamesNavigation(routing);
