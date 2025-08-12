'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Profile() {
  const [age, setAge] = useState('30')
  const [sex, setSex] = useState<'male'|'female'>('male')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')
  const [tdee, setTdee] = useState(2000)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const prof = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (prof.data) {
        setAge(String(prof.data.age || '30'))
        setSex((prof.data.sex || 'male') as 'male'|'female')
        setHeight(String(prof.data.height_cm || '175'))
        setWeight(String(prof.data.weight_kg || '70'))
        if (prof.data.tdee) setTdee(Math.round(prof.data.tdee))
      }
    })()
  }, [])

  function bmr() {
    const a = Number(age), h = Number(height), w = Number(weight)
    return sex==='male' ? (10*w + 6.25*h - 5*a + 5) : (10*w + 6.25*h - 5*a - 161)
  }
  function calcTdee() {
    const factor = 1.375
    return Math.round(bmr() * factor)
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please sign in'); return }
    const data = {
      id: user.id,
      age: Number(age),
      height_cm: Number(height),
      weight_kg: Number(weight),
      sex,
      tdee: calcTdee()
    }
    const { error } = await supabase.from('profiles').upsert(data).eq('id', user.id)
    if (error) alert(error.message)
    else { setTdee(data.tdee); alert('Saved!') }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">用戶資料</h1>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="年齡" value={age} onChange={e=>setAge(e.target.value)} />
        <select value={sex} onChange={e=>setSex(e.target.value as any)}>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
        <input placeholder="身高(cm)" value={height} onChange={e=>setHeight(e.target.value)} />
        <input placeholder="體重(kg)" value={weight} onChange={e=>setWeight(e.target.value)} />
      </div>
      <div className="p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 text-sm">
        <div>BMR：{Math.round(bmr())} kcal</div>
        <div>TDEE（估）：{calcTdee()} kcal</div>
      </div>
      <button className="w-full btn-primary" onClick={save}>儲存</button>
    </div>
  )
}