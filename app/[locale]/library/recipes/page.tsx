'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Recipes() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [perCal, setPerCal] = useState('')
  const [list, setList] = useState<any[]>([])

  async function preview() {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`)
    const j = await res.json()
    setTitle(j.title||'')
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please sign in'); return }
    const { error } = await supabase.from('recipes').insert({
      user_id: user.id,
      url,
      title,
      tags: tags ? tags.split(',').map((s:string)=>s.trim()) : [],
      per_serving_calories: perCal ? Number(perCal) : null
    })
    if (error) alert(error.message)
    else { setUrl(''); setTitle(''); setTags(''); setPerCal(''); load() }
  }

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('recipes').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setList(data || [])
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">食譜庫</h1>
      <input className="w-full" placeholder="Recipe / YouTube URL" value={url} onChange={e=>setUrl(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={preview} className="btn">預覽</button>
        <button onClick={save} className="btn-primary">儲存</button>
      </div>
      <input className="w-full" placeholder="標題" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="w-full" placeholder="每份卡路里（可選）" value={perCal} onChange={e=>setPerCal(e.target.value)} />
      <input className="w-full" placeholder="標籤（以逗號分隔）" value={tags} onChange={e=>setTags(e.target.value)} />

      <div className="grid gap-3 mt-6">
        {list.map(r => (
          <div className="card p-3" key={r.id}>
            <div className="text-sm font-medium">{r.title}</div>
            <div className="text-xs text-gray-500">{r.url}</div>
          </div>
        ))}
      </div>
    </div>
  )
}