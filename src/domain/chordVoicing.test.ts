import { describe, expect, it } from 'vitest'
import { MIDI_MAX, MIDI_MIN } from './constants'
import {
  CHORD_TYPE_OPTIONS,
  chordMidisForShortcutRoot,
  chordMidisInKeyboardRange,
  chordSymbolLabel,
  ROOT_SHORTCUT_MAX_MIDI,
  ROOT_SHORTCUT_MIN_MIDI,
  shortcutRootMidiFromPitchClass,
} from './chordVoicing'

describe('chordVoicing', () => {
  it('maps pitch class to C4–B4 shortcut root MIDI', () => {
    expect(shortcutRootMidiFromPitchClass(0)).toBe(60)
    expect(shortcutRootMidiFromPitchClass(11)).toBe(71)
  })

  it('covers all shortcut roots × chord types within keyboard range', () => {
    for (let r = ROOT_SHORTCUT_MIN_MIDI; r <= ROOT_SHORTCUT_MAX_MIDI; r++) {
      for (const { id } of CHORD_TYPE_OPTIONS) {
        const midis = chordMidisForShortcutRoot(r, id)
        expect(chordMidisInKeyboardRange(midis)).toBe(true)
        expect(new Set(midis).size).toBe(midis.length)
      }
    }
  })

  it('BM7 例: B4 ルートで長七の和音が鍵盤内', () => {
    const midis = chordMidisForShortcutRoot(71, 'M7')
    expect(midis).toEqual([71, 75, 78, 82])
    expect(Math.min(...midis)).toBeGreaterThanOrEqual(MIDI_MIN)
    expect(Math.max(...midis)).toBeLessThanOrEqual(MIDI_MAX)
  })

  it('chordSymbolLabel', () => {
    expect(chordSymbolLabel(0, 'maj')).toBe('C')
    expect(chordSymbolLabel(11, 'M7')).toBe('BM7')
    expect(chordSymbolLabel(2, 'm7b5')).toBe('Dm7(b5)')
  })
})
