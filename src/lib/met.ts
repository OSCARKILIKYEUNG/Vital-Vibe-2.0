// src/lib/met.ts
export type ActivityKey = keyof typeof ACTIVITIES;

export const ACTIVITIES = {
  // 有氧 / 走路跑步
  walking_slow:      {label: '步行（慢）', met: 2.8, category: '有氧'},
  walking_brisk:     {label: '快走',       met: 3.8, category: '有氧'},
  running_8kph:      {label: '慢跑 8 km/h', met: 8.3, category: '有氧'},
  running_10kph:     {label: '跑步 10 km/h', met: 10.0, category: '有氧'},
  running_12kph:     {label: '跑步 12 km/h', met: 12.5, category: '有氧'},

  cycling_easy:      {label: '騎車（輕鬆）', met: 4.0, category: '有氧'},
  cycling_moderate:  {label: '騎車（中等）', met: 6.8, category: '有氧'},
  cycling_vigorous:  {label: '騎車（強）',   met: 8.8, category: '有氧'},

  elliptical:        {label: '橢圓機',       met: 5.0, category: '器械'},
  stair_climber:     {label: '登階機',       met: 8.8, category: '器械'},

  // 重訓 / 自重
  strength_light:    {label: '重訓（輕）',   met: 3.5, category: '肌力'},
  strength_moderate: {label: '重訓（中）',   met: 5.0, category: '肌力'},
  strength_vigorous: {label: '重訓（強）',   met: 6.0, category: '肌力'},
  calisthenics_mod:  {label: '徒手訓練（中）', met: 3.8, category: '自重'},
  calisthenics_vig:  {label: '徒手訓練（強）', met: 8.0, category: '自重'},
  hiit:              {label: 'HIIT 間歇',    met: 9.0, category: '間歇'},

  // 球類
  basketball:        {label: '籃球',         met: 6.5, category: '球類'},
  football_soccer:   {label: '足球',         met: 7.0, category: '球類'},
  table_tennis:      {label: '桌球',         met: 4.0, category: '球類'},
  tennis:            {label: '網球',         met: 7.3, category: '球類'},
  badminton:         {label: '羽球',         met: 5.5, category: '球類'},
  volleyball:        {label: '排球（休閒）',  met: 3.0, category: '球類'},
  baseball:          {label: '棒球',         met: 5.0, category: '球類'},
  frisbee:           {label: '飛盤（休閒）',  met: 3.0, category: '球類'},
  golf_walking:      {label: '高爾夫（步行揹包）', met: 4.8, category: '球類'},

  // 其他
  yoga:              {label: '瑜伽',         met: 2.5, category: '身心'},
  pilates:           {label: '皮拉提斯',     met: 3.0, category: '身心'},
  swimming_easy:     {label: '游泳（輕鬆）',  met: 6.0, category: '水上'},
  swimming_fast:     {label: '游泳（快速）',  met: 8.0, category: '水上'},
  hiking:            {label: '健行',         met: 6.0, category: '戶外'},
  jump_rope:         {label: '跳繩',         met: 11.0, category: '間歇'}
} as const;

export const MET_MAP: Record<string, number> = Object.fromEntries(
  Object.entries(ACTIVITIES).map(([k, v]) => [k, v.met])
);

// 常見公式：卡路里 = MET × 3.5 × 體重(kg) / 200 × 分鐘
export function caloriesByMET(weightKg: number, met: number, durationMin: number) {
  if (!weightKg || !met || !durationMin) return 0;
  return +(met * 3.5 * weightKg / 200 * durationMin).toFixed(1);
}

// HR 估算（非常粗略）：每分鐘消耗 ≈ 0.6309*HR + 0.1988*體重(kg) + 0.2017*年齡 - 55.0969（男）
// 為簡化：以通用係數近似，僅做參考（非醫療建議）
export function caloriesByHR(weightKg: number, avgHr: number, durationMin: number) {
  if (!weightKg || !avgHr || !durationMin) return 0;
  const perMin = 0.12 * avgHr + 0.08 * weightKg - 5; // 簡化近似
  return +Math.max(perMin * durationMin, 0).toFixed(1);
}
