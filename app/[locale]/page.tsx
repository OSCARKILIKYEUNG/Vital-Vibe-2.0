'use client'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'
import { supabase } from '@/lib/supabaseClient'
import RingChart from '@/components/RingChart'
import { useEffect, useState } from 'react'

export default function Page() {
  const t = useTranslations('app')
  const [goal, setGoal] = useState(2000)
  const [intake, setIntake] = useState(0)
  const [burned, setBurned] = useState(0)
  const since = dayjs().startOf('day').toISOString()

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const prof = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (prof.data?.tdee) setGoal(Math.round(prof.data.tdee))

      const meals = await supabase.from('meals').select('items, logged_at').gte('logged_at', since).eq('user_id', user.id)
      const todayIntake = (meals.data || []).reduce((sum: number, m: any) => {
        const cals = (m.items || []).reduce((s: number, it: any) => s + (it.calories || 0), 0)
        return sum + cals
      }, 0)
      setIntake(todayIntake)

      const ex = await supabase.from('exercises').select('calories, logged_at').gte('logged_at', since).eq('user_id', user.id)
      const todayBurned = (ex.data || []).reduce((s: number, e: any) => s + (e.calories || 0), 0)
      setBurned(todayBurned)
    })()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t('dashboard')}</h1>
      <div className="flex items-center gap-6">
        <RingChart intake={intake} burned={burned} goal={goal} />
        <div className="text-sm space-y-2">
          <div>🎯 {t('today')}: {Math.round(goal)} kcal</div>
          <div>🍽️ {t('intake')}: {Math.round(intake)} kcal</div>
          <div>🔥 {t('burned')}: {Math.round(burned)} kcal</div>
          <div>✅ {t('remaining')}: {Math.max(0, Math.round(goal - intake + burned))} kcal</div>
        </div>
      </div>
    </div>
  )
}