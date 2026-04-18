import type { RGB } from './types'

/** H: 度（0–360）、S・V: 0–1 → sRGB 0–255 にクランプ */
export function hsvToRgb(h: number, s: number, v: number): RGB {
  const hh = ((h % 360) + 360) % 360
  const c = v * s
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1))
  const m = v - c

  let rp = 0
  let gp = 0
  let bp = 0
  if (hh < 60) {
    rp = c
    gp = x
  } else if (hh < 120) {
    rp = x
    gp = c
  } else if (hh < 180) {
    gp = c
    bp = x
  } else if (hh < 240) {
    gp = x
    bp = c
  } else if (hh < 300) {
    rp = x
    bp = c
  } else {
    rp = c
    bp = x
  }

  const clamp255 = (n: number) => Math.max(0, Math.min(255, Math.round(n * 255)))

  return {
    r: clamp255(rp + m),
    g: clamp255(gp + m),
    b: clamp255(bp + m),
  }
}
