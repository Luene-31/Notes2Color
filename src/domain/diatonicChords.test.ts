import { describe, expect, it } from 'vitest'
import { allDiatonicTriadsInKeyboardRange, DIATONIC_TRIADS_C_MAJOR, sameMidiSelection } from './diatonicChords'

describe('diatonicChords', () => {
  it('keeps all triad notes within keyboard MIDI range', () => {
    expect(allDiatonicTriadsInKeyboardRange()).toBe(true)
  })

  it('sameMidiSelection ignores order', () => {
    expect(sameMidiSelection([60, 64, 67], [67, 60, 64])).toBe(true)
    expect(sameMidiSelection([60, 64], [60, 64, 67])).toBe(false)
  })

  it('has 7 diatonic degrees', () => {
    expect(DIATONIC_TRIADS_C_MAJOR).toHaveLength(7)
  })
})
