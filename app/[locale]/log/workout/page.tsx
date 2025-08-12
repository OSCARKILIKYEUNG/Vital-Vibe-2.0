'use client'
import { useState, useEffect, useMemo } from 'react'
import { ACTIVITIES, MET_MAP, caloriesByMET, caloriesByHR } from '@/lib/met'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabaseClient'

export default function WorkoutLog() {
  const t = useTranslations('app')
  const [type, setType] = useState<string>('running_easy')
  const [custom, setCustom] = useState('')
  const [duration, setDuration] = useState('30')
  const [avgHr, setAvgHr] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set(Object.values(ACTIVITIES).map(a => a.category))
    return ['all', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    return Object.entries(ACTIVITIES).filter(([k, v]) => {
      const byCat = category === 'all' || v.category === category
      const byText = !query || v.label.toLowerCase().includes(query.toLowerCase()) || k.includes(query.toLowerCase())
      return byCat && byText
    })
  }, [query, category])

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const prof = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      setProfile(prof.data || null)
    })()
  }, [])

  async function extractFromImage() {
    if (!image) return
    const fd = new FormData(); fd.append('image', image); fd.append('kind','workout')
    const res = await fetch('/api/analyze', { method:'POST', body: fd })
    const data = await res.json()
    if (data.avgHr) setAvgHr(String(Math.round(data.avgHr)))
    if (data.duration) setDuration(String(Math.round(data.duration)))
    if (data.typeKey && MET_MAP[data.typeKey]) setType(data.typeKey)
  }

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please sign in'); setSaving(false); return }

    let weightKg = Number(profile?.weight_kg || 70)
    let age = Number(profile?.age || 30)
    let sex = (profile?.sex || 'male') as 'male'|'female'

    const minutes = Number(duration || '0')
    const key = custom ? 'custom' : type
    const met = custom ? 6.0 : (MET_MAP[key] || 6.0)
    const kcal = avgHr
      ? caloriesByHR({ sex, age, weightKg, avgHr: Number(avgHr), minutes })
      : caloriesByMET(met, weightKg, minutes)

    let image_url: string | null = null
    if (image) {
      const path = `${user.id}/${Date.now()}-${image.name}`
      const { error: upErr } = await supabase.storage.from('workout-uploads').upload(path, image, { upsert: false })
      if (!upErr) {
        const { data: pub } = supabase.storage.from('workout-uploads').getPublicUrl(path)
        image_url = pub.publicUrl
      }
    }

    const { error } = await supabase.from('exercises').insert({
      user_id: user.id,
      type: custom || ACTIVITIES[type]?.label || type,
      duration_min: minutes,
      met,
      avg_hr: avgHr ? Number(avgHr) : null,
      calories: Math.round(kcal)
    })
    if (error) alert(error.message)
    else { setCustom(''); setDuration('30'); setAvgHr(''); setImage(null); alert('Saved!') }
    setSaving(false)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">{t('logWorkout')}</h1>

      <div className="space-y-2">
        <label className="block">搜尋/篩選活動</label>
        <div className="flex gap-2">
          <input className="flex-1" placeholder="輸入關鍵字如：籃球、跑步…" value={query} onChange={e=>setQuery(e.target.value)} />
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <label className="block">選擇活動</label>
      <select className="w-full" value={type} onChange={e=>setType(e.target.value)}>
        {filtered.map(([k, v]) => (
          <option key={k} value={k}>{v.label} · {v.met} MET</option>
        ))}
      </select>
      <input className="w-full" placeholder="或輸入自訂活動名稱（會以一般 6.0 MET 計）" value={custom} onChange={e=>setCustom(e.target.value)} />

      <div className="space-y-2">
        <label className="block">{t('durationMin')}</label>
        <input className="w-full" value={duration} onChange={e=>setDuration(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block">{t('avgHr')}</label>
        <input className="w-full" value={avgHr} onChange={e=>setAvgHr(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block">錶面截圖 上載</label>
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
        <button onClick={extractFromImage} className="btn">AI 解析錶面</button>
      </div>

      <button className="w-full btn-primary" disabled={saving} onClick={save}>{t('save')}</button>
    </div>
  )
}