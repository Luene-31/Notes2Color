import { describe, expect, it } from 'vitest'
import { midiToLabel, octaveNumber, pitchClass } from './midi'

describe('midi', () => {
  it('C4 は MIDI 60', () => {
    expect(midiToLabel(60)).toBe('C4')
    expect(octaveNumber(60)).toBe(4)
    expect(pitchClass(60)).toBe(0)
  })

  it('C5 は MIDI 72', () => {
    expect(midiToLabel(72)).toBe('C5')
    expect(octaveNumber(72)).toBe(5)
    expect(pitchClass(72)).toBe(0)
  })
})
