'use client';

import React from 'react';
import {useTranslations} from 'next-intl';

type Props = {
  consumed: number;       // 已攝取
  burned: number;         // 已消耗（運動）
  target: number;         // 每日目標（TDEE 或自定）
  size?: number;          // 圓大小(px)
  stroke?: number;        // 圓厚度
  showCenter?: boolean;   // 中央是否顯示數值
};

function clamp(n: number, min = 0, max = Number.POSITIVE_INFINITY) {
  return Math.max(min, Math.min(max, n));
}

export default function RingChart({
  consumed,
  burned,
  target,
  size = 200,
  stroke = 14,
  showCenter = true
}: Props) {
  const t = useTranslations('Dashboard');

  const safeTarget = clamp(target, 0);
  const safeConsumed = clamp(consumed, 0);
  const safeBurned = clamp(burned, 0);

  // 為了讓三段合為 100%，使用分母 = 目標 + 已消耗
  // 「已攝取」顯示不超過目標的部分，避免超標導致比例 > 100%
  const consumedClamped = Math.min(safeConsumed, safeTarget);
  const denom = Math.max(1, safeTarget + safeBurned);

  const segConsumed = consumedClamped / denom;
  const segBurned = safeBurned / denom;
  const segRemaining = Math.max(safeTarget - consumedClamped, 0) / denom; // 一定使三段相加 = 1

  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;

  // strokeDasharray 寫入 [片段長度, 空白長度]
  const arc = (fraction: number) => `${(fraction * C).toFixed(3)} ${(C - fraction * C).toFixed(3)}`;

  // 每個 segment 的起始累計
  const start1 = 0;
  const start2 = segConsumed;
  const start3 = segConsumed + segBurned;

  const offset = (start: number) => (C * (1 - start)) % C;

  const remainingNumber = Math.max(safeTarget - (safeConsumed - safeBurned), 0);
  const centerText = Math.round(remainingNumber);

  return (
    <div className="relative inline-block" style={{width: size, height: size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* 背景圈 */}
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth={stroke}
        />
        {/* Consumed */}
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke="#111827" /* 黑灰 */
          strokeWidth={stroke}
          strokeDasharray={arc(segConsumed)}
          strokeDashoffset={offset(start1)}
          strokeLinecap="round"
        />
        {/* Burned */}
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke="#3B82F6" /* 藍 */
          strokeWidth={stroke}
          strokeDasharray={arc(segBurned)}
          strokeDashoffset={offset(start2)}
          strokeLinecap="round"
        />
        {/* Remaining */}
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke="#10B981" /* 綠 */
          strokeWidth={stroke}
          strokeDasharray={arc(segRemaining)}
          strokeDashoffset={offset(start3)}
          strokeLinecap="round"
        />
      </svg>

      {showCenter && (
        <div className="absolute inset-0 grid place-items-center rotate-90">
          <div className="text-center">
            <div className="text-2xl font-semibold tabular-nums">{centerText}</div>
            <div className="text-xs opacity-60">{t('remaining')}</div>
          </div>
        </div>
      )}

      {/* 圖例 */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Legend color="#111827" label={t('pieLegendConsumed')} value={Math.round(safeConsumed)} />
        <Legend color="#3B82F6" label={t('pieLegendBurned')} value={Math.round(safeBurned)} />
        <Legend color="#10B981" label={t('pieLegendRemaining')} value={Math.round(remainingNumber)} />
      </div>
    </div>
  );
}

function Legend({color, label, value}: {color: string; label: string; value: number}) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block h-3 w-3 rounded-sm" style={{backgroundColor: color}} />
      <span className="truncate">{label}</span>
      <span className="ml-auto tabular-nums">{value}</span>
    </div>
  );
}
