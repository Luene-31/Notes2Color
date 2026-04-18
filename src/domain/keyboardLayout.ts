import { pitchClass } from './midi'

/** ピアノ白鍵に対応する音程クラス */
const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11])

export function isWhiteKeyMidi(midi: number): boolean {
  return WHITE_PITCH_CLASSES.has(pitchClass(midi))
}

/**
 * 連続 MIDI 範囲内の白鍵（左から右）
 */
export function whiteMidisInRange(minMidi: number, maxMidi: number): number[] {
  const out: number[] = []
  for (let m = minMidi; m <= maxMidi; m++) {
    if (isWhiteKeyMidi(m)) out.push(m)
  }
  return out
}

/**
 * 黒鍵の配置。`boundaryIndex` は白鍵行の「右隣の白鍵」のインデックス（最後の黒鍵は最右端用に `whiteMidis.length`）
 */
export function blackKeyLayoutInRange(
  minMidi: number,
  maxMidi: number,
  whiteMidis: readonly number[],
): { midi: number; boundaryIndex: number }[] {
  const layout: { midi: number; boundaryIndex: number }[] = []
  for (let m = minMidi; m <= maxMidi; m++) {
    if (isWhiteKeyMidi(m)) continue
    const rightIdx = whiteMidis.findIndex((w) => w > m)
    const boundaryIndex = rightIdx === -1 ? whiteMidis.length : rightIdx
    layout.push({ midi: m, boundaryIndex })
  }
  return layout
}
