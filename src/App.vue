<script setup lang="ts">
import { computed, ref } from 'vue'
import ColorPanel from './components/ColorPanel.vue'
import PianoKeyboard from './components/PianoKeyboard.vue'
import {
  CHORD_TYPE_OPTIONS,
  chordMidisForShortcutRoot,
  chordSymbolLabel,
  shortcutRootMidiFromPitchClass,
  type ChordTypeId,
} from './domain/chordVoicing'
import { DIATONIC_TRIADS_C_MAJOR, sameMidiSelection } from './domain/diatonicChords'
import { mixFromMidiSet } from './domain/mixing'
import { noteNameForPitchClass } from './domain/midi'
import type { MixMode } from './domain/types'

const selectedMidis = ref<number[]>([])
const mixMode = ref<MixMode>('additive')

/** ルートは C4〜B4（pitch class 0〜11）× コード種類（ショートカット用） */
const chordBuilderRootPc = ref(0)
const chordBuilderType = ref<ChordTypeId>('maj')

const PITCH_CLASS_OPTIONS = Array.from({ length: 12 }, (_, pc) => ({
  value: pc,
  label: noteNameForPitchClass(pc),
}))

const chordBuilderMidis = computed(() =>
  chordMidisForShortcutRoot(
    shortcutRootMidiFromPitchClass(chordBuilderRootPc.value),
    chordBuilderType.value,
  ),
)

const chordBuilderSymbol = computed(() =>
  chordSymbolLabel(chordBuilderRootPc.value, chordBuilderType.value),
)

function showChordFromBuilder() {
  selectedMidis.value = [...chordBuilderMidis.value]
}

function clearChordBuilderSelection() {
  selectedMidis.value = []
}

function isChordBuilderSelectionShown(): boolean {
  return sameMidiSelection(selectedMidis.value, chordBuilderMidis.value)
}

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

/** 同じ和音が既に選ばれていれば解除、そうでなければその和音だけを選択 */
function toggleDiatonicChord(midis: readonly number[]) {
  if (sameMidiSelection(selectedMidis.value, midis)) {
    selectedMidis.value = []
    return
  }
  selectedMidis.value = [...midis].sort((a, b) => a - b)
}

function isChordActive(midis: readonly number[]): boolean {
  return sameMidiSelection(selectedMidis.value, midis)
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
        <div class="mb-4">
          <p class="mb-2 text-sm text-neutral-600">
            ダイアトニック（C 長調・三和音）: タップで和音を入力、もう一度タップで解除
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="ch in DIATONIC_TRIADS_C_MAJOR"
              :key="ch.label"
              type="button"
              class="min-h-[44px] rounded-md border px-3 text-sm font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              :class="
                isChordActive(ch.midis)
                  ? 'border-amber-600 bg-amber-100 text-amber-950 ring-2 ring-amber-500 ring-offset-1'
                  : 'border-neutral-400 bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
              "
              :aria-pressed="isChordActive(ch.midis)"
              :aria-label="`${ch.label}。${isChordActive(ch.midis) ? '選択中' : '未選択'}`"
              @click="toggleDiatonicChord(ch.midis)"
            >
              {{ ch.label }}
            </button>
          </div>
        </div>
        <div class="mb-4 border-t border-neutral-200 pt-4">
          <p class="mb-2 text-sm text-neutral-600">
            ルート（C4〜B4）× コード種類: 組み合わせを選び、「表示」で鍵盤に反映、「クリア」で選択解除
          </p>
          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label class="flex min-w-[8rem] flex-col gap-1 text-sm text-neutral-700">
              <span class="font-medium">ルート音</span>
              <select
                v-model.number="chordBuilderRootPc"
                class="min-h-[44px] rounded-md border border-neutral-400 bg-white px-2 py-2 text-sm text-neutral-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <option v-for="o in PITCH_CLASS_OPTIONS" :key="o.value" :value="o.value">
                  {{ o.label }}（オクターブ 4）
                </option>
              </select>
            </label>
            <label class="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm text-neutral-700">
              <span class="font-medium">コード種類</span>
              <select
                v-model="chordBuilderType"
                class="min-h-[44px] rounded-md border border-neutral-400 bg-white px-2 py-2 text-sm text-neutral-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <option v-for="t in CHORD_TYPE_OPTIONS" :key="t.id" :value="t.id">
                  {{ t.label }}
                </option>
              </select>
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="min-h-[44px] rounded-md border border-blue-600 bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                :aria-pressed="isChordBuilderSelectionShown()"
                :aria-label="`${chordBuilderSymbol} を鍵盤に表示`"
                @click="showChordFromBuilder"
              >
                表示（{{ chordBuilderSymbol }}）
              </button>
              <button
                type="button"
                class="min-h-[44px] rounded-md border border-neutral-400 bg-neutral-50 px-4 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                aria-label="鍵盤の選択をすべて解除"
                @click="clearChordBuilderSelection"
              >
                クリア
              </button>
            </div>
          </div>
        </div>
        <PianoKeyboard :selected="selectedSet" @toggle="toggleMidi" />
      </section>
    </main>

    <footer class="border-t border-neutral-200 bg-white px-4 py-4 text-center text-xs text-neutral-500">
      仕様: リポジトリ内 <code class="rounded bg-neutral-100 px-1">doc/SPEC_MAPPING_AND_MIXING.md</code>
    </footer>
  </div>
</template>
