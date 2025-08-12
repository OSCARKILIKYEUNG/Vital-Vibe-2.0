'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

type Props = { intake: number; burned: number; goal: number }

export default function RingChart({ intake, burned, goal }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const t = useTranslations('app')

  useEffect(() => {
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    const size = Math.min(c.width, c.height)
    const cx = size / 2, cy = size / 2, r = size / 2 - 12

    ctx.clearRect(0,0,c.width,c.height)

    function arc(value: number, max: number, start: number, color: string) {
      const end = start + (Math.min(value, max) / (max || 1)) * Math.PI * 2
      ctx.beginPath()
      ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.lineCap = 'round'
      ctx.arc(cx, cy, r, start, end)
      ctx.stroke()
    }

    const remaining = Math.max(0, goal - intake + burned)

    // 背景圈
    ctx.beginPath(); ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 12
    ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()

    arc(intake, goal, -Math.PI/2, '#ef4444')
    arc(burned, goal, -Math.PI/2 + 0.12, '#0EA5E9')
    arc(remaining, goal, -Math.PI/2 + 0.24, '#0A84FF')

    ctx.fillStyle = '#111827'
    ctx.font = 'bold 16px system-ui, -apple-system, Segoe UI, Roboto'
    const center = `${t('remainingCenter')}`
    const val = `${Math.max(0, Math.round(remaining))} kcal`
    const tw = ctx.measureText(center).width
    ctx.fillText(center, cx - tw/2, cy - 6)
    ctx.font = 'bold 18px system-ui, -apple-system, Segoe UI, Roboto'
    const vw = ctx.measureText(val).width
    ctx.fillText(val, cx - vw/2, cy + 16)
  }, [intake, burned, goal])

  return <canvas ref={canvasRef} width={200} height={200} />
}