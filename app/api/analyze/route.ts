import { NextRequest, NextResponse } from 'next/server'
import { MET_MAP } from '@/lib/met'

export const runtime = 'nodejs'

async function googleVision(base64: string) {
  const key = process.env.GOOGLE_CLOUD_VISION_API_KEY!
  const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        image: { content: base64 },
        features: [{ type: 'LABEL_DETECTION', maxResults: 5 }]
      }]
    })
  })
  const json = await res.json() as any
  const labels: string[] = json?.responses?.[0]?.labelAnnotations?.map((l:any)=>l.description) || []
  return labels
}

async function usdaSearch(query: string) {
  const key = process.env.USDA_API_KEY!
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${key}`
  const res = await fetch(url)
  const data = await res.json() as any
  const food = data?.foods?.[0]
  if (!food) return null
  const caloriesNutr = food.foodNutrients?.find((n:any)=> String(n.nutrientName||'').toLowerCase().includes('energy'))
  return { name: food.description, caloriesPer100g: caloriesNutr?.value || null }
}

async function openrouterEstimate(prompt: string) {
  const key = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o'
  if (!key) return null
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a nutrition & fitness assistant. Respond with concise JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    })
  })
  const json = await res.json() as any
  try { return JSON.parse(json.choices[0].message.content) } catch { return null }
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('image') as File | null
  const kind = String(form.get('kind') || 'name')
  if (!file) return NextResponse.json({ error: 'no_file' }, { status: 400 })

  const buf = Buffer.from(await file.arrayBuffer())
  const base64 = buf.toString('base64')

  const labels = await googleVision(base64)

  if (kind === 'workout') {
    const guess = await openrouterEstimate(`From these wearable screenshot labels: ${labels.join(', ')}. Guess fields as JSON: { "avgHr": number, "duration": number, "typeKey": one of [${Object.keys(MET_MAP).join(',')}] }`)
    return NextResponse.json(guess || { labels })
  }

  let usda = null
  for (const l of labels) {
    usda = await usdaSearch(l)
    if (usda) break
  }

  if (kind === 'name') {
    const name = usda?.name || labels[0] || ''
    return NextResponse.json({ name, labels, usda })
  }

  if (kind === 'quantity') {
    const est = await openrouterEstimate(`Estimate portion for food: ${usda?.name || labels[0]}. Respond JSON {"quantity":{"value":number,"unit":"g|ml|serving"}}`)
    return NextResponse.json(est || { quantity: { value: 1, unit: 'serving' } })
  }

  if (kind === 'calories') {
    if (usda?.caloriesPer100g) {
      return NextResponse.json({ calories: usda.caloriesPer100g })
    }
    const est = await openrouterEstimate(`Estimate calories for: ${usda?.name || labels[0]}. Respond JSON {"calories": number}`)
    return NextResponse.json(est || { calories: 200 })
  }

  return NextResponse.json({ labels, usda })
}