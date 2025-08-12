'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function SignIn() {
  const t = useTranslations('app')
  const r = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'in'|'up'>('in')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null)
    const fn = mode === 'in' ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { error } = await fn({ email, password }) as any
    if (error) setError(error.message)
    else r.push('../')
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <h1 className="text-xl font-semibold">{t('signIn')}</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full btn-primary">{mode==='in'?'Sign In':'Sign Up'}</button>
        <button type="button" className="w-full text-sm underline" onClick={()=>setMode(mode==='in'?'up':'in')}>
          {mode==='in'?'Create account':'Have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}