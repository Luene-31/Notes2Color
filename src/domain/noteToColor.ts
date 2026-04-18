import { FIXED_S, FIXED_V, H0_BY_PITCH_CLASS } from './constants'
import { hsvToRgb } from './hsvToRgb'
import type { RGB } from './types'
import { pitchClass } from './midi'

/** 単音 MIDI → RGB（SPEC §2–3） */
export function midiToRgb(midi: number): RGB {
  const pc = pitchClass(midi)
  const h0 = H0_BY_PITCH_CLASS[pc]!
  return hsvToRgb(h0, FIXED_S, FIXED_V)
}

