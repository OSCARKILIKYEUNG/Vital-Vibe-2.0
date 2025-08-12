# Vital Vibe (Next.js 14 + Supabase)

Zero-localhost path: upload this repo to GitHub → import to Vercel → set env vars → done.

## 1) What you need
- Supabase project
- Vercel account
- API keys: Google Vision, USDA FoodData Central, OpenRouter (optional), Link Preview API

## 2) Supabase
- In Supabase SQL Editor, run: `supabase/schema.sql` then `supabase/policies.sql`.
- Create Storage buckets: `meal-images` and `workout-uploads`.
- (Optional) Run `supabase/storage-policies.sql` to allow authenticated uploads + public reads.

## 3) Environment Variables (Vercel → Project Settings → Environment Variables)
Copy `.env.example` keys and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_CLOUD_VISION_API_KEY`
- `USDA_API_KEY`
- `OPENROUTER_API_KEY` (optional) + `OPENROUTER_MODEL=openai/gpt-4o`
- `LINK_PREVIEW_API_KEY` (+ optional `LINK_PREVIEW_API_ENDPOINT`)
- `NEXT_PUBLIC_DEFAULT_LOCALE=zh-Hant`

## 4) Deploy
- Push this folder as a new GitHub repo.
- Import to Vercel → Framework: **Next.js** → Build.
- Visit `/{locale}` e.g. `/zh-Hant` or `/en`.

## 5) Notes
- `/api/analyze` uses **Node runtime** for Buffer.
- Link Preview API is tried first, then oEmbed/OG fallback.
- RLS policies ensure each user only sees **their own** rows.
- Dashboard ring shows **Remaining** kcal in the center.