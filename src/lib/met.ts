// src/lib/met.ts
export type Intensity = 'light' | 'moderate' | 'vigorous';

export type ActivityKey =
  | 'running'
  | 'walking'
  | 'cycling'
  | 'strength_training'
  | 'hiit'
  | 'yoga'
  | 'swimming'
  | 'stair_climbing'
  | 'soccer'
  | 'basketball'
  | 'table_tennis'
  | 'elliptical'
  | 'frisbee'
  | 'golf_walking'
  | 'calisthenics'
  | 'calisthenics_vigorous'
  | 'pilates'
  | 'rower'
  | 'boxing'
  | 'badminton'
  | 'volleyball'
  | 'tennis'
  | 'hiking';

export type Activity = {
  label: string;            // UI 顯示（繁中）
  category: string;         // 分類：跑步／球類／器械／自重…（純顯示）
  met?: number;             // 預設 MET
  intensityMet?: Partial<Record<Intensity, number>>; // 依強度覆蓋
  notes?: string;           // 額外說明（可不顯示）
};

export const MET_TABLE: Record<ActivityKey, Activity> = {
  running: {
    label: '跑步',
    category: '有氧',
    // 跑步依速度差異很大，先用中強度；UI 可讓用戶挑更細速度版本（之後擴充）
    intensityMet: { light: 6.0, moderate: 9.8, vigorous: 11.5 },
    notes: '實際依速度差異很大，之後可細分 8~16 km/h'
  },
  walking: {
    label: '步行',
    category: '有氧',
    intensityMet: { light: 2.5, moderate: 3.3, vigorous: 3.8 }
  },
  cycling: {
    label: '騎車（公路/健身車）',
    category: '有氧',
    intensityMet: { light: 4.0, moderate: 6.8, vigorous: 8.5 }
  },
  strength_training: {
    label: '重訓（器械/自由重量）',
    category: '阻力',
    intensityMet: { light: 3.5, moderate: 5.0, vigorous: 6.0 }
  },
  hiit: {
    label: 'HIIT 間歇訓練',
    category: '有氧/阻力',
    met: 8.0
  },
  yoga: {
    label: '瑜伽',
    category: '柔軟/核心',
    met: 3.0
  },
  swimming: {
    label: '游泳',
    category: '有氧',
    intensityMet: { light: 6.0, moderate: 8.0, vigorous: 10.0 }
  },
  stair_climbing: {
    label: '登階/爬樓梯',
    category: '有氧',
    met: 8.8
  },
  soccer: {
    label: '足球',
    category: '球類',
    intensityMet: { light: 6.0, moderate: 7.0, vigorous: 10.0 }
  },
  basketball: {
    label: '籃球',
    category: '球類',
    intensityMet: { light: 4.5, moderate: 6.5, vigorous: 8.0 }
  },
  table_tennis: {
    label: '桌球（乒乓）',
    category: '球類',
    met: 4.0
  },
  elliptical: {
    label: '橢圓機',
    category: '器械',
    intensityMet: { light: 4.5, moderate: 5.0, vigorous: 5.5 }
  },
  frisbee: {
    label: '飛盤（休閒）',
    category: '球類',
    met: 3.0
  },
  golf_walking: {
    label: '高爾夫（步行揹包）',
    category: '球類',
    met: 4.8
  },
  calisthenics: {
    label: '徒手訓練（中）',
    category: '自重',
    met: 4.0
  },
  calisthenics_vigorous: {
    label: '徒手訓練（強）',
    category: '自重',
    met: 8.0
  },
  pilates: {
    label: '皮拉提斯',
    category: '柔軟/核心',
    met: 3.0
  },
  rower: {
    label: '划船機',
    category: '器械',
    intensityMet: { light: 4.5, moderate: 7.0, vigorous: 8.5 }
  },
  boxing: {
    label: '拳擊（綜合/沙袋）',
    category: '格鬥',
    intensityMet: { light: 5.5, moderate: 7.0, vigorous: 9.0 }
  },
  badminton: {
    label: '羽球',
    category: '球類',
    intensityMet: { light: 4.5, moderate: 5.5, vigorous: 7.0 }
  },
  volleyball: {
    label: '排球（休閒）',
    category: '球類',
    met: 3.5
  },
  tennis: {
    label: '網球',
    category: '球類',
    intensityMet: { light: 5.0, moderate: 7.0, vigorous: 8.0 }
  },
  hiking: {
    label: '健行/登山',
    category: '有氧',
    intensityMet: { light: 5.3, moderate: 6.0, vigorous: 7.0 }
  }
};

export type MetLookup = typeof MET_TABLE;

export function getMetValue(
  type: ActivityKey,
  intensity?: Intensity
): number {
  const item = MET_TABLE[type];
  if (!item) return 4.0; // 安全預設
  if (intensity && item.intensityMet?.[intensity]) {
    return item.intensityMet[intensity]!;
  }
  return item.met ?? item.intensityMet?.moderate ?? 4.0;
}

/**
 * 卡路里估算（ACSM 標準公式）
 * kcal = MET × 3.5 × 體重(kg) / 200 × 時長(分鐘)
 */
export function estimateCaloriesByMET(params: {
  type: ActivityKey;
  weightKg: number;
  durationMin: number;
  intensity?: Intensity;
  avgHr?: number; // 非必要；若提供，可做微幅加權
}): number {
  const { type, weightKg, durationMin, intensity, avgHr } = params;
  let met = getMetValue(type, intensity);

  // 若有心跳，對 MET 做 5~10% 的微調（很保守），避免誤導
  if (avgHr && Number.isFinite(avgHr)) {
    // 以 120bpm 當作中強度的中位數，做線性微調（±10% 封頂）
    const delta = Math.max(-0.1, Math.min(0.1, (avgHr - 120) / 120 / 2));
    met = met * (1 + delta);
  }

  const kcal = (met * 3.5 * weightKg) / 200 * durationMin;
  // 四捨五入到 1 位小數
  return Math.round(kcal * 10) / 10;
}

/** 供 UI 下拉選單使用 */
export const activityOptions: Array<{
  key: ActivityKey;
  label: string;
  category: string;
}> = Object.entries(MET_TABLE).map(([key, v]) => ({
  key: key as ActivityKey,
  label: v.label,
  category: v.category
}));
