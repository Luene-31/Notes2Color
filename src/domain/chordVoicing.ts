import { MIDI_MAX, MIDI_MIN } from './constants'
import { noteNameForPitchClass } from './midi'

/** コードショートカット用ルート: C4（60）〜 B4（71） */
export const ROOT_SHORTCUT_MIN_MIDI = 60
export const ROOT_SHORTCUT_MAX_MIDI = 71

export type ChordTypeId =
  | 'maj'
  | 'm'
  | '7'
  | 'm7'
  | 'M7'
  | 'sus4'
  | 'dim'
  | 'm7b5'
  | 'aug'
  | '6'

export const CHORD_TYPE_OPTIONS: readonly { readonly id: ChordTypeId; readonly label: string }[] = [
  { id: 'maj', label: 'maj' },
  { id: 'm', label: 'm' },
  { id: '7', label: '7' },
  { id: 'm7', label: 'm7' },
  { id: 'M7', label: 'M7' },
  { id: 'sus4', label: 'sus4' },
  { id: 'dim', label: 'dim' },
  { id: 'm7b5', label: 'm7(b5)' },
  { id: 'aug', label: 'aug' },
  { id: '6', label: '6' },
]

const INTERVALS: Record<ChordTypeId, readonly number[]> = {
  maj: [0, 4, 7],
  m: [0, 3, 7],
  7: [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  M7: [0, 4, 7, 11],
  sus4: [0, 5, 7],
  dim: [0, 3, 6],
  m7b5: [0, 3, 6, 10],
  aug: [0, 4, 8],
  6: [0, 4, 7, 9],
}

/** C4〜B4 のルート MIDI（pitch class 0〜11 → 60〜71） */
export function shortcutRootMidiFromPitchClass(pc: number): number {
  const p = ((pc % 12) + 12) % 12
  return ROOT_SHORTCUT_MIN_MIDI + p
}

/** ルート（ショートカット範囲）とコード種類から構成音 MIDI（表示鍵盤 G3〜B5 内） */
export function chordMidisForShortcutRoot(
  rootMidi: number,
  type: ChordTypeId,
): readonly number[] {
  if (
    !Number.isInteger(rootMidi) ||
    rootMidi < ROOT_SHORTCUT_MIN_MIDI ||
    rootMidi > ROOT_SHORTCUT_MAX_MIDI
  ) {
    throw new RangeError(
      `rootMidi must be integer in ${ROOT_SHORTCUT_MIN_MIDI}..${ROOT_SHORTCUT_MAX_MIDI}`,
    )
  }
  const iv = INTERVALS[type]
  const raw = iv.map((d) => rootMidi + d)
  return raw.map((m) => fitMidiToKeyboard(m)).sort((a, b) => a - b)
}

function fitMidiToKeyboard(midi: number): number {
  let m = midi
  while (m < MIDI_MIN) m += 12
  while (m > MIDI_MAX) m -= 12
  return m
}

/** 表示用（例: B + M7 → "BM7"） */
export function chordSymbolLabel(rootPitchClass: number, type: ChordTypeId): string {
  const name = noteNameForPitchClass(rootPitchClass)
  const suffix =
    type === 'maj'
      ? ''
      : type === 'm7b5'
        ? 'm7(b5)'
        : type
  return `${name}${suffix}`
}

export function chordMidisInKeyboardRange(midis: readonly number[]): boolean {
  return midis.every((m) => m >= MIDI_MIN && m <= MIDI_MAX)
}
