import type { RGB } from './types'
import { midiToRgb } from './noteToColor'

/** 重複を除いた MIDI 集合から混色後の RGB（0 音は null） */
export function mixFromMidiSet(
  midis: Iterable<number>,
  mode: 'additive' | 'subtractive',
): RGB | null {
  const unique = [...new Set(midis)].sort((a, b) => a - b)
  if (unique.length === 0) return null
  const rgbs = unique.map((m) => midiToRgb(m))
  return mode === 'additive' ? mixAdditive(rgbs) : mixSubtractive(rgbs)
}

/**
 * 加法混色（SPEC 4.1）: 線形和のあと k = max(R_sum,G_sum,B_sum,255) でスケール。
 * k===0 のときは黒を返す（ガード）。
 */
export function mixAdditive(rgbs: RGB[]): RGB {
  if (rgbs.length === 0) {
    return { r: 0, g: 0, b: 0 }
  }
  let rSum = 0
  let gSum = 0
  let bSum = 0
  for (const { r, g, b } of rgbs) {
    rSum += r
    gSum += g
    bSum += b
  }
  const k = Math.max(rSum, gSum, bSum, 255)
  if (k === 0) {
    return { r: 0, g: 0, b: 0 }
  }
  return {
    r: Math.round((255 * rSum) / k),
    g: Math.round((255 * gSum) / k),
    b: Math.round((255 * bSum) / k),
  }
}

/**
 * 減法混色（SPEC 4.2）: RGB→CMY 乗算型合成→RGB。
 */
export function mixSubtractive(rgbs: RGB[]): RGB {
  if (rgbs.length === 0) {
    return { r: 0, g: 0, b: 0 }
  }
  let prodC = 1
  let prodM = 1
  let prodY = 1
  for (const { r, g, b } of rgbs) {
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255
    const c = 1 - rn
    const m = 1 - gn
    const y = 1 - bn
    prodC *= 1 - c
    prodM *= 1 - m
    prodY *= 1 - y
  }
  const C = 1 - prodC
  const M = 1 - prodM
  const Y = 1 - prodY
  const rr = 1 - C
  const gg = 1 - M
  const bb = 1 - Y
  return {
    r: Math.max(0, Math.min(255, Math.round(rr * 255))),
    g: Math.max(0, Math.min(255, Math.round(gg * 255))),
    b: Math.max(0, Math.min(255, Math.round(bb * 255))),
  }
}
