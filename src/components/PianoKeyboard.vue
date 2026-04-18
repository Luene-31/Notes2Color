<script setup lang="ts">
import { MIDI_MAX, MIDI_MIN } from '../domain/constants'
import { blackKeyLayoutInRange, whiteMidisInRange } from '../domain/keyboardLayout'
import { midiToLabel } from '../domain/midi'

const WHITE_MIDIS = whiteMidisInRange(MIDI_MIN, MIDI_MAX)
const BLACK_LAYOUT = blackKeyLayoutInRange(MIDI_MIN, MIDI_MAX, WHITE_MIDIS)
const WHITE_KEY_COUNT = WHITE_MIDIS.length

/** 黒鍵の幅・高さ（px）。白鍵幅はコンテナに合わせて可変 */
const BW = 22
const BH = 76

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

/** 白鍵 i 列の左端位置（%）に揃えた黒鍵の left（親幅に対する % ベース） */
function blackLeftStyle(boundaryIndex: number): Record<string, string> {
  const pct = (boundaryIndex / WHITE_KEY_COUNT) * 100
  return {
    left: `calc(${pct}% - ${BW / 2}px)`,
    width: `${BW}px`,
    height: `${BH}px`,
  }
}
</script>

<template>
  <div class="w-full pb-2">
    <p class="mb-2 text-sm text-neutral-600">
      表示範囲: MIDI {{ MIDI_MIN }}（{{ midiToLabel(MIDI_MIN) }}）〜 {{ MIDI_MAX }}（{{
        midiToLabel(MIDI_MAX)
      }}）
    </p>
    <div class="relative mx-auto flex w-full min-w-0 select-none">
      <button
        v-for="m in WHITE_MIDIS"
        :key="m"
        type="button"
        class="key-white relative box-border flex min-h-[132px] min-w-[22px] flex-1 basis-0 flex-col items-center justify-end border border-neutral-500 pb-2 text-xs font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        :class="
          isSelected(m)
            ? 'z-[5] key-white--selected'
            : 'z-0 bg-white'
        "
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
        class="absolute top-0 box-border rounded-b-md border border-neutral-800 text-[10px] text-neutral-100 shadow-md transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        :class="
          isSelected(b.midi)
            ? 'z-20 key-black--selected'
            : 'z-10 bg-neutral-900'
        "
        :style="blackLeftStyle(b.boundaryIndex)"
        :aria-pressed="isSelected(b.midi)"
        :aria-label="`${midiToLabel(b.midi)}。${isSelected(b.midi) ? '選択中' : '未選択'}`"
        @click.stop="onToggle(b.midi)"
      >
        <span class="mt-auto pb-1">{{ midiToLabel(b.midi).replace(/\d+$/, '') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.key-white--selected {
  /* 網掛け + 下地（帯と隙間で交互） */
  background-color: #fff;
  background-image: repeating-linear-gradient(
    -36deg,
    rgba(245, 158, 11, 0.4) 0 5px,
    rgba(255, 255, 255, 0.72) 5px 10px
  );
  box-shadow:
    inset 0 0 0 2px rgba(217, 119, 6, 0.45),
    0 1px 2px rgba(0, 0, 0, 0.06);
}

.key-black--selected {
  background-color: rgb(23 23 23);
  background-image: repeating-linear-gradient(
    -36deg,
    rgba(251, 191, 36, 0.48) 0 4px,
    rgba(30, 30, 30, 0.88) 4px 8px
  );
  box-shadow:
    inset 0 0 0 1px rgba(251, 191, 36, 0.45),
    0 2px 4px rgba(0, 0, 0, 0.35);
}
</style>
