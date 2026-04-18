import { describe, expect, it } from 'vitest'
import { midiToRgb } from './noteToColor'

describe('noteToColor', () => {
  it('単音 C4 は H=0° 系の色（R が支配的）', () => {
    const { r, g, b } = midiToRgb(60)
    expect(r).toBeGreaterThan(g)
    expect(r).toBeGreaterThan(b)
  })

  it('オクターブ違いは同じ色相（D4 と D5 は同一 RGB）', () => {
    expect(midiToRgb(62)).toEqual(midiToRgb(74))
  })
})
