'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'

export default function Videos() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [thumb, setThumb] = useState('')
  const [tags, setTags] = useState('')
  const [list, setList] = useState<any[]>([])

  async function preview() {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`)
    const j = await res.json()
    setTitle(j.title||''); setThumb(j.thumbnail||'')
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Please sign in'); return }
    const { error } = await supabase.from('videos').insert({
      user_id: user.id,
      youtube_url: url,
      title,
      tags: tags ? tags.split(',').map(s=>s.trim()) : []
    })
    if (error) alert(error.message)
    else { setUrl(''); setTitle(''); setThumb(''); setTags(''); load() }
  }

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('videos').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setList(data || [])
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">影片庫</h1>
      <input className="w-full" placeholder="YouTube URL 或一般連結" value={url} onChange={e=>setUrl(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={preview} className="btn">預覽</button>
        <button onClick={save} className="btn-primary">儲存</button>
      </div>
      {thumb && <Image src={thumb} alt={title} width={320} height={180} className="rounded-xl"/>}
      <input className="w-full" placeholder="標題" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="w-full" placeholder="標籤（以逗號分隔）" value={tags} onChange={e=>setTags(e.target.value)} />

      <div className="grid gap-3 mt-6">
        {list.map(v => (
          <div className="card p-3" key={v.id}>
            <div className="flex items-center gap-3">
              <div className="w-28 h-16 bg-gray-100 rounded-lg overflow-hidden">
                {v.thumbnail ? <Image src={v.thumbnail} alt={v.title} width={160} height={90}/> : null}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{v.title}</div>
                <div className="text-xs text-gray-500">{v.youtube_url}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}