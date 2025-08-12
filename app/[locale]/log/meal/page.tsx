'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabaseClient'

type Item = { name: string; calories: number; qty: number; unit: string }

export default function MealLog() {
  const t = useTranslations('app')
  const [image, setImage] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('serving')
  const [calories, setCalories] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)

  async function analyze(kind: 'name'|'quantity'|'calories') {
    if (!image) return
    setAnalyzing(true)
    const fd = new FormData(); fd.append('image', image); fd.append('kind', kind)
    const res = await fetch('/api/analyze', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.name && (kind==='name')) setName(data.name)
    if (data.quantity && (kind==='quantity')) { setQuantity(String(data.quantity.value)); setUnit(data.quantity.unit || unit) }
    if (data.calories && (kind==='calories')) setCalories(String(Math.round(data.calories)))
    setAnalyzing(false)
  }

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please sign in'); setSaving(false); return }
    let image_url: string | null = null

    if (image) {
      const path = `${user.id}/${Date.now()}-${image.name}`
      const { data: up, error: upErr } = await supabase.storage.from('meal-images').upload(path, image, { upsert: false })
      if (upErr) { alert(upErr.message); setSaving(false); return }
      const { data: pub } = supabase.storage.from('meal-images').getPublicUrl(path)
      image_url = pub.publicUrl
    }

    const item: Item = { name: name || 'Food', calories: Number(calories || '0'), qty: Number(quantity || '1'), unit }
    const { error } = await supabase.from('meals').insert({
      user_id: user.id,
      items: [item],
      image_url
    })
    if (error) alert(error.message)
    else { setName(''); setCalories(''); setQuantity('1'); setUnit('serving'); setImage(null); alert('Saved!') }
    setSaving(false)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">{t('logMeal')}</h1>
      <input type="file" accept="image/*" capture="environment" onChange={e=>setImage(e.target.files?.[0]||null)} />

      <div className="space-y-2">
        <label className="block">{t('name')}</label>
        <div className="flex gap-2">
          <input className="flex-1" value={name} onChange={e=>setName(e.target.value)} />
          <button disabled={!image||analyzing} onClick={()=>analyze('name')} className="btn">{t('analyzePhoto')}</button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block">{t('quantity')} / {t('unit')}</label>
        <div className="flex gap-2">
          <input className="w-24" value={quantity} onChange={e=>setQuantity(e.target.value)} />
          <input className="flex-1" value={unit} onChange={e=>setUnit(e.target.value)} />
          <button disabled={!image||analyzing} onClick={()=>analyze('quantity')} className="btn">{t('aiEstimate')}</button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block">{t('calories')}</label>
        <div className="flex gap-2">
          <input className="flex-1" value={calories} onChange={e=>setCalories(e.target.value)} />
          <button disabled={!image||analyzing} onClick={()=>analyze('calories')} className="btn">{t('aiEstimate')}</button>
        </div>
      </div>

      <button className="w-full btn-primary" disabled={saving} onClick={save}>{t('save')}</button>
    </div>
  )
}