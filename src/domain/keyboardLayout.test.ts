import { describe, expect, it } from 'vitest'
import { MIDI_MAX, MIDI_MIN } from './constants'
import { blackKeyLayoutInRange, whiteMidisInRange } from './keyboardLayout'

describe('keyboardLayout', () => {
  it('G3〜B5 の白鍵は 17 個', () => {
    const w = whiteMidisInRange(MIDI_MIN, MIDI_MAX)
    expect(w).toEqual([
      55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83,
    ])
  })

  it('黒鍵は 12 個・最右の黒鍵は A#5（最右白は B5 の左隣）', () => {
    const w = whiteMidisInRange(MIDI_MIN, MIDI_MAX)
    const b = blackKeyLayoutInRange(MIDI_MIN, MIDI_MAX, w)
    expect(b).toHaveLength(12)
    const aSharp5 = b.find((x) => x.midi === 82)
    expect(aSharp5).toEqual({ midi: 82, boundaryIndex: w.length - 1 })
  })

  it('全構成音が鍵盤範囲内', () => {
    for (let m = MIDI_MIN; m <= MIDI_MAX; m++) {
      const w = whiteMidisInRange(m, m)
      const b = blackKeyLayoutInRange(m, m, w)
      expect(w.length + b.length).toBe(1)
    }
  })
})
