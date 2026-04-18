import { MIDI_MAX, MIDI_MIN } from './constants'

/** C 長調・ダイアトニック三和音（表示鍵盤内の構成音） */
export const DIATONIC_TRIADS_C_MAJOR: readonly {
  readonly label: string
  readonly midis: readonly number[]
}[] = [
  { label: 'C', midis: [60, 64, 67] },
  { label: 'Dm', midis: [62, 65, 69] },
  { label: 'Em', midis: [64, 67, 71] },
  { label: 'F', midis: [65, 69, 72] },
  { label: 'G', midis: [67, 71, 74] },
  { label: 'Am', midis: [69, 72, 76] },
  { label: 'B°', midis: [71, 74, 77] },
]

export function sameMidiSelection(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length) return false
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.every((v, i) => v === sb[i]!)
}

/** 開発時・テスト用: 全構成音が鍵盤範囲内か */
export function allDiatonicTriadsInKeyboardRange(): boolean {
  return DIATONIC_TRIADS_C_MAJOR.every((c) =>
    c.midis.every((m) => m >= MIDI_MIN && m <= MIDI_MAX),
  )
}
