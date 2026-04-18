# Note2Color

音階（白鍵・黒鍵を含む 12 平均律）を色相空間に写し、単音・和音を色（表示）に変換する Web アプリです（プロトタイプ）。

## 仕様

`doc/` 配下の [SPEC_MAPPING_AND_MIXING.md](./doc/SPEC_MAPPING_AND_MIXING.md) を正とします。

## 必要環境

- Node.js（LTS 推奨）
- [pnpm](https://pnpm.io/)（`npm install -g pnpm` など）

## ローカル開発

```bash
pnpm install
pnpm dev
```

ブラウザで **`http://localhost:5173/Note2Color/`** を開いてください（`vite.config.ts` の `base` がリポジトリ名に合わせてあります）。

## ビルド・プレビュー・テスト

```bash
pnpm run build
pnpm preview
pnpm test
```

## 公開（GitHub Pages）

[doc/BUILD_AND_DEPLOY.md](./doc/BUILD_AND_DEPLOY.md) を参照してください。
