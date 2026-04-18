import { MIDI_MAX, MIDI_MIN } from './constants'

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

export function isMidiInRange(midi: number): boolean {
  return Number.isInteger(midi) && midi >= MIDI_MIN && midi <= MIDI_MAX
}

export function pitchClass(midi: number): number {
  const pc = midi % 12
  return pc < 0 ? pc + 12 : pc
}

/** 表示用オクターブ（MIDI 慣習: floor(midi/12)-1） */
export function octaveNumber(midi: number): number {
  return Math.floor(midi / 12) - 1
}

export function noteNameForPitchClass(pc: number): string {
  const i = ((pc % 12) + 12) % 12
  return NOTE_NAMES[i]!
}

/** 例: 60 → "C4", 72 → "C5" */
export function midiToLabel(midi: number): string {
  return `${noteNameForPitchClass(pitchClass(midi))}${octaveNumber(midi)}`
}
