import { describe, expect, it } from 'vitest'
import { MIDI_MAX, MIDI_MIN } from './constants'
import { blackKeyLayoutInRange, whiteMidisInRange } from './keyboardLayout'

describe('keyboardLayout', () => {
  it('C4〜F#5 の白鍵は 11 個', () => {
    const w = whiteMidisInRange(MIDI_MIN, MIDI_MAX)
    expect(w).toEqual([60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77])
  })

  it('黒鍵は 8 個・F#5 は最右境界', () => {
    const w = whiteMidisInRange(MIDI_MIN, MIDI_MAX)
    const b = blackKeyLayoutInRange(MIDI_MIN, MIDI_MAX, w)
    expect(b).toHaveLength(8)
    const fSharp5 = b.find((x) => x.midi === 78)
    expect(fSharp5).toEqual({ midi: 78, boundaryIndex: w.length })
  })

  it('全構成音が鍵盤範囲内', () => {
    for (let m = MIDI_MIN; m <= MIDI_MAX; m++) {
      const w = whiteMidisInRange(m, m)
      const b = blackKeyLayoutInRange(m, m, w)
      expect(w.length + b.length).toBe(1)
    }
  })
})
