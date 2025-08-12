import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'no_url' }, { status: 400 })

  const key = process.env.LINK_PREVIEW_API_KEY
  const endpoint = process.env.LINK_PREVIEW_API_ENDPOINT || 'https://api.linkpreview.net'

  if (key) {
    try {
      const api = `${endpoint}?key=${encodeURIComponent(key)}&q=${encodeURIComponent(url)}`
      const r = await fetch(api)
      if (r.ok) {
        const j = await r.json()
        return NextResponse.json({
          title: j.title || '',
          description: j.description || '',
          thumbnail: j.image || '',
          url: j.url || url
        })
      }
    } catch (e) {
      // fall through
    }
  }

  if (/youtube\.com|youtu\.be/.test(url)) {
    const o = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
    if (o.ok) {
      const j = await o.json()
      return NextResponse.json({ title: j.title, thumbnail: j.thumbnail_url, url })
    }
  }

  try {
    const htmlRes = await fetch(url)
    const html = await htmlRes.text()
    const titleMatch = /<meta property="og:title" content="([^"]+)"/i.exec(html) || /<title>([^<]+)<\/title>/i.exec(html)
    const imageMatch = /<meta property="og:image" content="([^"]+)"/i.exec(html)
    const descMatch = /<meta property="og:description" content="([^"]+)"/i.exec(html)
    const title = titleMatch ? titleMatch[1] : ''
    const image = imageMatch ? imageMatch[1] : ''
    const desc = descMatch ? descMatch[1] : ''
    return NextResponse.json({ title, thumbnail: image, description: desc, url })
  } catch {
    return NextResponse.json({ title: '', thumbnail: '', url })
  }
}