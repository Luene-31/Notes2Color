<script setup lang="ts">
import { computed } from 'vue'
import type { RGB } from '../domain/types'
import { rgbToHsv } from '../domain/rgbToHsv'
import { PLACEHOLDER_BG } from '../domain/constants'

const props = defineProps<{
  rgb: RGB | null
}>()

const hex = computed(() => {
  if (!props.rgb) return '—'
  const { r, g, b } = props.rgb
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  )
})

const hsvText = computed(() => {
  if (!props.rgb) return '—'
  const { h, s, v } = rgbToHsv(props.rgb.r, props.rgb.g, props.rgb.b)
  const hd = Math.round(h * 10) / 10
  const sd = Math.round(s * 1000) / 1000
  const vd = Math.round(v * 1000) / 1000
  return `H ${hd}° / S ${sd} / V ${vd}`
})

const rgbText = computed(() => {
  if (!props.rgb) return '—'
  const { r, g, b } = props.rgb
  return `R ${r} / G ${g} / B ${b}`
})

const boxStyle = computed(() => ({
  backgroundColor: props.rgb ? `rgb(${props.rgb.r},${props.rgb.g},${props.rgb.b})` : PLACEHOLDER_BG,
}))
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      class="h-36 w-full max-w-xl rounded-lg border-2 border-neutral-600 shadow-inner"
      :style="boxStyle"
      role="img"
      :aria-label="rgb ? `表示色 ${hex}` : '音が選択されていません'"
    />
    <dl class="grid grid-cols-1 gap-1 text-sm text-neutral-800 sm:grid-cols-3 sm:gap-4">
      <div>
        <dt class="font-medium text-neutral-600">RGB</dt>
        <dd class="font-mono">{{ rgbText }}</dd>
      </div>
      <div>
        <dt class="font-medium text-neutral-600">HEX</dt>
        <dd class="font-mono">{{ hex }}</dd>
      </div>
      <div class="sm:col-span-1">
        <dt class="font-medium text-neutral-600">HSV（表示色から算出）</dt>
        <dd class="font-mono text-xs sm:text-sm">{{ hsvText }}</dd>
      </div>
    </dl>
  </div>
</template>
