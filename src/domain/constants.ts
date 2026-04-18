/** 鍵盤: C4（60）〜 C5（72）、両端含む 13 鍵 */
export const MIDI_MIN = 60
export const MIDI_MAX = 72

/** 固定 HSV（オクターブ補正なし） */
export const FIXED_S = 0.9
export const FIXED_V = 0.95

/** 音が 0 個のときのプレースホルダ背景（SPEC 4.3） */
export const PLACEHOLDER_BG = '#202020'

/** 音クラス 0=C … 11=B → 色相 H₀（度）、赤=0° 時計回りに半音 +30° */
export const H0_BY_PITCH_CLASS: readonly number[] = [
  0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
]
