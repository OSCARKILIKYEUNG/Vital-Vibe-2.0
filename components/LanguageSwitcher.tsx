'use client'
import { usePathname, useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const parts = pathname.split('/')
  const current = parts[1]
  const switchTo = current === 'zh-Hant' ? 'en' : 'zh-Hant'
  function onClick() {
    parts[1] = switchTo
    router.push(parts.join('/'))
  }
  return (
    <button onClick={onClick} className="text-sm px-3 py-1 rounded-xl border border-gray-300 dark:border-gray-700">
      {switchTo === 'en' ? 'EN' : '繁中'}
    </button>
  )
}