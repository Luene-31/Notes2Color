<script setup lang="ts">
import { MIDI_MAX, MIDI_MIN } from '../domain/constants'
import { midiToLabel } from '../domain/midi'

const WHITE_MIDIS = [60, 62, 64, 65, 67, 69, 71, 72] as const
const BLACK_LAYOUT: { midi: number; boundaryIndex: number }[] = [
  { midi: 61, boundaryIndex: 1 },
  { midi: 63, boundaryIndex: 2 },
  { midi: 66, boundaryIndex: 4 },
  { midi: 68, boundaryIndex: 5 },
  { midi: 70, boundaryIndex: 6 },
]

/** 白鍵 1 個分の幅(px)。黒鍵は境界に中揃え */
const KW = 48
const BW = 28
const BH = 88

const props = defineProps<{
  selected: ReadonlySet<number>
}>()

const emit = defineEmits<{
  toggle: [midi: number]
}>()

function isSelected(m: number): boolean {
  return props.selected.has(m)
}

function onToggle(m: number) {
  emit('toggle', m)
}

function blackLeftPx(boundaryIndex: number): number {
  return boundaryIndex * KW - BW / 2
}
</script>

<template>
  <div class="w-full overflow-x-auto pb-2">
    <p class="mb-2 text-sm text-neutral-600">
      表示範囲: MIDI {{ MIDI_MIN }}（{{ midiToLabel(MIDI_MIN) }}）〜 {{ MIDI_MAX }}（{{
        midiToLabel(MIDI_MAX)
      }}）
    </p>
    <div
      class="relative mx-auto flex select-none"
      :style="{ width: `${WHITE_MIDIS.length * KW}px`, minWidth: `${WHITE_MIDIS.length * KW}px` }"
    >
      <button
        v-for="m in WHITE_MIDIS"
        :key="m"
        type="button"
        class="relative z-0 box-border flex min-h-[140px] min-w-[44px] flex-1 flex-col items-center justify-end border border-neutral-500 bg-white pb-2 text-xs font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        :class="
          isSelected(m)
            ? 'bg-amber-100 ring-2 ring-amber-500 ring-offset-1'
            : ''
        "
        :style="{ width: `${KW}px`, flex: `0 0 ${KW}px` }"
        :aria-pressed="isSelected(m)"
        :aria-label="`${midiToLabel(m)}。${isSelected(m) ? '選択中' : '未選択'}`"
        @click="onToggle(m)"
      >
        <span class="pointer-events-none px-0.5 text-center leading-tight">{{ midiToLabel(m) }}</span>
      </button>

      <button
        v-for="b in BLACK_LAYOUT"
        :key="b.midi"
        type="button"
        class="absolute top-0 z-10 box-border rounded-b-md border border-neutral-800 bg-neutral-900 text-[10px] text-neutral-100 shadow-md transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        :class="
          isSelected(b.midi)
            ? 'ring-2 ring-amber-400 ring-offset-1'
            : ''
        "
        :style="{
          left: `${blackLeftPx(b.boundaryIndex)}px`,
          width: `${BW}px`,
          height: `${BH}px`,
        }"
        :aria-pressed="isSelected(b.midi)"
        :aria-label="`${midiToLabel(b.midi)}。${isSelected(b.midi) ? '選択中' : '未選択'}`"
        @click.stop="onToggle(b.midi)"
      >
        <span class="mt-auto pb-1">{{ midiToLabel(b.midi).replace(/\d+$/, '') }}</span>
      </button>
    </div>
  </div>
</template>
