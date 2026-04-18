import { describe, expect, it } from 'vitest'
import { midiToRgb } from './noteToColor'
import { mixAdditive, mixFromMidiSet } from './mixing'

describe('mixing', () => {
  it('和音の順序を変えても加法の結果は同じ（可換）', () => {
    const a = mixFromMidiSet([60, 64, 67], 'additive')
    const b = mixFromMidiSet([67, 60, 64], 'additive')
    expect(a).toEqual(b)
  })

  it('加法: 正規化により極端に常に真っ白にはなりにくい（代表値）', () => {
    const rgb = mixAdditive([midiToRgb(60), midiToRgb(64), midiToRgb(67)])
    expect(rgb.r + rgb.g + rgb.b).toBeLessThan(255 * 3)
  })

  it('減法でも和音の順序を変えても同じ', () => {
    const a = mixFromMidiSet([60, 64], 'subtractive')
    const b = mixFromMidiSet([64, 60], 'subtractive')
    expect(a).toEqual(b)
  })

  it('音が 0 個のときは null', () => {
    expect(mixFromMidiSet([], 'additive')).toBeNull()
    expect(mixFromMidiSet([], 'subtractive')).toBeNull()
  })
})
