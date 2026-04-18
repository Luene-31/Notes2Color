<script setup lang="ts">
import { computed, ref } from 'vue'
import ColorPanel from './components/ColorPanel.vue'
import PianoKeyboard from './components/PianoKeyboard.vue'
import { mixFromMidiSet } from './domain/mixing'
import type { MixMode } from './domain/types'

const selectedMidis = ref<number[]>([])
const mixMode = ref<MixMode>('additive')

const selectedSet = computed(() => new Set(selectedMidis.value))

const resultRgb = computed(() => mixFromMidiSet(selectedMidis.value, mixMode.value))

function toggleMidi(midi: number) {
  const next = new Set(selectedMidis.value)
  if (next.has(midi)) next.delete(midi)
  else next.add(midi)
  selectedMidis.value = [...next].sort((a, b) => a - b)
}

function clearAll() {
  selectedMidis.value = []
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 text-neutral-900">
    <header class="border-b border-neutral-200 bg-white px-4 py-4 shadow-sm">
      <h1 class="text-xl font-semibold tracking-tight">Note2Color</h1>
      <p class="mt-1 text-sm text-neutral-600">
        12 平均律の音を色相に対応させ、和音を混色して 1 色として表示します。色相は可視光の並びに
        <strong class="font-medium">近いイメージ</strong>の対応であり、厳密な波長再現ではありません。
      </p>
      <p class="mt-2 text-sm text-neutral-600">
        基準音: <span class="font-mono">A4 = 440 Hz</span>（説明用。音声は出力しません）
      </p>
    </header>

    <main class="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
      <section class="rounded-lg bg-white p-4 shadow">
        <h2 class="mb-3 text-sm font-semibold text-neutral-700">表示色</h2>
        <ColorPanel :rgb="resultRgb" />
      </section>

      <section class="rounded-lg bg-white p-4 shadow">
        <h2 class="mb-3 text-sm font-semibold text-neutral-700">混色モード</h2>
        <div class="flex flex-wrap items-center gap-3">
          <label class="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              v-model="mixMode"
              type="radio"
              value="additive"
              class="h-4 w-4 accent-neutral-900"
            />
            加法混色（RGB・正規化付き線形和）
          </label>
          <label class="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              v-model="mixMode"
              type="radio"
              value="subtractive"
              class="h-4 w-4 accent-neutral-900"
            />
            減法混色（CMY・乗算型）
          </label>
        </div>
      </section>

      <section class="rounded-lg bg-white p-4 shadow">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-sm font-semibold text-neutral-700">鍵盤（タップで選択／解除）</h2>
          <button
            type="button"
            class="min-h-[44px] min-w-[44px] rounded-md border border-neutral-400 bg-neutral-50 px-3 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            @click="clearAll"
          >
            すべてクリア
          </button>
        </div>
        <PianoKeyboard :selected="selectedSet" @toggle="toggleMidi" />
      </section>
    </main>

    <footer class="border-t border-neutral-200 bg-white px-4 py-4 text-center text-xs text-neutral-500">
      仕様: リポジトリ内 <code class="rounded bg-neutral-100 px-1">doc/SPEC_MAPPING_AND_MIXING.md</code>
    </footer>
  </div>
</template>
