/** 表示用: sRGB 0–255 → HSV、H は度 */
export function rgbToHsv(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; v: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (d !== 0) {
    if (max === rn) {
      h = 60 * (((gn - bn) / d + 6) % 6)
    } else if (max === gn) {
      h = 60 * ((bn - rn) / d + 2)
    } else {
      h = 60 * ((rn - gn) / d + 4)
    }
  }
  return { h, s, v }
}
