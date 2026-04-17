# 技術スタック（推奨）

## 1. 方針

- **静的サイト + クライアント完結** でホスティングコストとプライバシー要件（[REQUIREMENTS.md](./REQUIREMENTS.md) NF-01）を満たす。
- 音—色変換と混色は **TypeScript** で実装し、**単体テスト** しやすくする。

## 2. フロントエンド

| 項目 | 推奨 | 理由 |
|------|------|------|
| 言語 | **TypeScript** | 音高・色変換の型安全、テスト容易 |
| UI フレームワーク | **React** または **Vue** または **Svelte** | 鍵盤の状態管理・モード切替が素直。どれでも可 |
| バンドラ | **Vite** | 高速、設定が軽い |
| スタイル | **CSS Modules** または **Tailwind CSS** | レスポンシブと鍵盤レイアウト。チームの好みで選択 |
| テスト | **Vitest** + （任意）**Testing Library** | Vite と相性が良い |

**最小構成（フレームワークなし）** も可能だが、鍵盤状態とモードが増えるため **コンポーネント指向を推奨**。

## 3. 色計算

- **外部ライブラリ必須ではない**。HSV/RGB/CMY は数十行で実装可能。
- 採用する場合の候補:
  - **culori**（色空間変換が豊富）
  - **chroma-js**（簡潔）

仕様は [SPEC_MAPPING_AND_MIXING.md](./SPEC_MAPPING_AND_MIXING.md) に固定しているため、ライブラリは **変換の補助** に留め、**ビジネスルールは自前モジュール** に集約する。

## 4. PWA（任意）

- **オフライン利用**（NF-04）を満たしたい場合:
  - **Vite PWA プラグイン**（`vite-plugin-pwa`）で manifest + service worker を生成。

## 5. ホスティング向け

| サービス | 備考 |
|----------|------|
| **GitHub Pages** | リポジトリ公開で無料、カスタムドメイン可。Vite は `base` 設定に注意 |
| **Cloudflare Pages** | ビルド連携が簡単、無料枠が大きい |
| **Netlify** | 同様に静的ホスティング向け |

**SPA のルーティング** を使う場合、ホスティング側の **rewrite**（全パスを `index.html` に）が必要なことがある。本アプリは **1ページ** で足りる想定。

## 6. 非推奨・補足

- **Python + matplotlib だけ** でスマホブラウザ向けに配布するのは、UI と配布形態の面で不利（サーバサイド画像生成はリアルタイム操作に不向き）。
- **WebAssembly で Python** などはオーバーエンジニアリングになりやすい。

## 7. リポジトリ構成（案）

```
/
  index.html
  src/
    main.ts / main.tsx
    components/
      PianoKeyboard.tsx
      ColorPanel.tsx
      ModeToggle.tsx
    domain/
      midi.ts          // MIDI ↔ 音名
      noteToColor.ts   // 単音 → RGB
      mixing.ts        // 加法・減法
      constants.ts     // H₀ テーブル、鍵盤範囲
  test/
    mixing.test.ts
  public/
  package.json
  vite.config.ts
  tsconfig.json
```

実装者は **ドメインロジックを UI から分離** すること。
