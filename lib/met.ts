export type ActivityInfo = { label: string; met: number; category: string }

export const ACTIVITIES: Record<string, ActivityInfo> = {
  walking_slow: { label: '步行（慢）', met: 2.8, category: '步行' },
  walking_brisk: { label: '步行（快）', met: 4.3, category: '步行' },
  hiking: { label: '健行/遠足', met: 6.0, category: '戶外' },
  running_easy: { label: '跑步（輕鬆）', met: 8.3, category: '跑步' },
  running_moderate: { label: '跑步（中等）', met: 9.8, category: '跑步' },
  running_vigorous: { label: '跑步（激烈）', met: 11.5, category: '跑步' },

  cycling_slow: { label: '騎車（慢速 <16 km/h）', met: 4.0, category: '單車' },
  cycling_moderate: { label: '騎車（中速 16–19 km/h）', met: 6.8, category: '單車' },
  cycling_fast: { label: '騎車（快速 20–22 km/h）', met: 8.0, category: '單車' },
  cycling_very_fast: { label: '騎車（非常快 >22 km/h）', met: 10.0, category: '單車' },
  cycling_stationary_light: { label: '飛輪/健身車（輕）', met: 3.5, category: '單車' },
  cycling_stationary_moderate: { label: '飛輪/健身車（中）', met: 6.8, category: '單車' },
  cycling_stationary_vigorous: { label: '飛輪/健身車（強）', met: 8.8, category: '單車' },

  strength_training: { label: '重訓（一般）', met: 6.0, category: '重訓' },
  strength_circuit: { label: '循環重量訓練', met: 8.0, category: '重訓' },
  hiit: { label: 'HIIT 高強度間歇', met: 9.0, category: '間歇' },
  pilates: { label: '皮拉提斯', met: 3.0, category: '身心' },
  yoga: { label: '瑜伽', met: 3.0, category: '身心' },
  stretching: { label: '伸展/柔軟', met: 2.3, category: '身心' },

  rowing: { label: '划船（戶外）', met: 7.0, category: '划船' },
  rowing_machine_moderate: { label: '划船機（中）', met: 7.0, category: '划船' },
  rowing_machine_vigorous: { label: '划船機（強）', met: 8.5, category: '划船' },

  stair_climbing: { label: '登階（機/樓梯）', met: 8.8, category: '登階' },
  elliptical: { label: '橢圓機', met: 5.0, category: '器械' },

  swimming_recreational: { label: '游泳（休閒）', met: 6.0, category: '游泳' },
  swimming_laps_slow: { label: '游泳（來回慢）', met: 7.0, category: '游泳' },
  swimming_laps_fast: { label: '游泳（來回快）', met: 9.8, category: '游泳' },
  swimming_breaststroke: { label: '蛙式', met: 10.3, category: '游泳' },
  swimming_freestyle: { label: '自由式', met: 8.0, category: '游泳' },
  swimming_butterfly: { label: '蝶式', met: 13.8, category: '游泳' },

  soccer: { label: '足球（一般）', met: 7.0, category: '球類' },
  basketball: { label: '籃球（休閒）', met: 6.5, category: '球類' },
  basketball_game: { label: '籃球（比賽）', met: 8.0, category: '球類' },
  table_tennis: { label: '桌球（乒乓）', met: 4.0, category: '球類' },
  badminton: { label: '羽毛球', met: 5.5, category: '球類' },
  tennis_singles: { label: '網球（單打）', met: 8.0, category: '球類' },
  tennis_doubles: { label: '網球（雙打）', met: 6.0, category: '球類' },
  volleyball: { label: '排球（休閒）', met: 3.0, category: '球類' },
  volleyball_beach_competitive: { label: '沙灘排球（競技）', met: 8.0, category: '球類' },

  boxing_sparring: { label: '拳擊（對打）', met: 9.0, category: '格鬥' },
  boxing_bag: { label: '拳擊（沙袋）', met: 7.8, category: '格鬥' },
  martial_arts: { label: '武術/綜合格鬥', met: 10.3, category: '格鬥' },
  kickboxing: { label: '踢拳', met: 8.0, category: '格鬥' },

  dance_general: { label: '舞蹈（一般）', met: 5.0, category: '舞蹈' },
  dance_hiphop: { label: '舞蹈（Hip-Hop）', met: 7.3, category: '舞蹈' },
  dance_ballroom: { label: '舞蹈（國標）', met: 3.5, category: '舞蹈' },

  skiing_downhill: { label: '高山滑雪', met: 7.0, category: '雪上' },
  skiing_cross_country: { label: '越野滑雪', met: 9.0, category: '雪上' },
  snowboarding: { label: '單板滑雪', met: 5.5, category: '雪上' },
  skating_ice: { label: '溜冰（冰上）', met: 7.0, category: '滑行' },
  skating_inline: { label: '直排輪', met: 7.5, category: '滑行' },

  climbing_rock: { label: '攀岩（室內/抱石）', met: 8.0, category: '攀登' },
  climbing_mountaineering: { label: '登山（含背負）', met: 9.0, category: '攀登' },

  surfing: { label: '衝浪', met: 3.0, category: '水上' },
  standup_paddle: { label: 'SUP 立槳', met: 6.0, category: '水上' },
  kayaking: { label: '皮划艇', met: 5.0, category: '水上' },
  canoeing: { label: '獨木舟', met: 3.5, category: '水上' },
  rowing_dragonboat: { label: '龍舟', met: 12.0, category: '划船' },

  jump_rope_slow: { label: '跳繩（慢）', met: 8.8, category: '自重' },
  jump_rope_fast: { label: '跳繩（快）', met: 12.3, category: '自重' },
  calisthenics_light: { label: '徒手訓練（輕）', met: 3.8, category: '自重' },
  calisthenics_vigorous: { label: '徒手訓練（強）', met: 8.0, category: '自重' },

  elliptical: { label: '橢圓機', met: 5.0, category: '器械' },
  frisbee: { label: '飛盤（休閒）', met: 3.0, category: '球類' },
  golf_walking: { label: '高爾夫（步行揹包）', met: 4.8, category: '球類' },

  gardening: { label: '園藝（中等）', met: 3.8, category: '日常' },
  house_cleaning: { label: '家務（掃地/拖地）', met: 3.5, category: '日常' }
}

export const MET_MAP: Record<string, number> = Object.fromEntries(
  Object.entries(ACTIVITIES).map(([k, v]) => [k, v.met])
)

export function caloriesByMET(met: number, weightKg: number, minutes: number) {
  return met * weightKg * (minutes / 60)
}

export function caloriesByHR(opts: {
  sex: 'male' | 'female',
  age: number,
  weightKg: number,
  avgHr: number,
  minutes: number
}) {
  const { sex, age, weightKg, avgHr, minutes } = opts
  const A = sex === 'male'
    ? (age * 0.2017) - (weightKg * 0.09036) + (avgHr * 0.6309) - 55.0969
    : (age * 0.074) - (weightKg * 0.05741) + (avgHr * 0.4472) - 20.4022
  const kcal = (A * minutes) / 4.184
  return Math.max(0, kcal)
}