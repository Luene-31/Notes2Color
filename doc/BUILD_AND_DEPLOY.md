# アプリ構築から公開までの流れ

前提: [TECH_STACK.md](./TECH_STACK.md) の **Vite + TypeScript + 任意フレームワーク**。

## 1. ローカル開発環境

1. **Node.js LTS** をインストール（例: 20.x 系。プロジェクトで `.nvmrc` や `engines` を置くとよい）。
2. プロジェクト作成:

   ```bash
   npm create vite@latest note2color -- --template react-ts
   ```

   （テンプレートは React でなくてもよい。）

3. 依存関係インストール: `npm install`
4. 開発サーバ: `npm run dev` → ブラウザで `http://localhost:5173`（既定）

## 2. 実装の順序（推奨）

1. **ドメイン層**: `midi` → 音クラス、`noteToColor`（HSV→RGB）、`mixing`（加法・CMY）。**Vitest で数値テスト**。
2. **UI**: 鍵盤（選択集合）、カラーボックス、モード切替、数値表示。
3. **レスポンシブ**: メディアクエリまたはモバイルファーストのレイアウト。
4. **ビルド確認**: `npm run build` → `npm run preview` で本番相当の確認。

## 3. 品質・公開前チェック

- `npm run build` がエラーなく通る。
- 主要ブラウザで **鍵盤・混色・表示** を確認（実機のスマホ推奨）。
- アクセシビリティ: コントラスト、フォーカス可能な操作（可能なら）。

## 4. 本番ビルド

- `npm run build` で `dist/`（または設定した出力ディレクトリ）に静的ファイルが生成される。

## 5. デプロイ（例: GitHub Pages）

### 5.1 リポジトリを `username.github.io` 以外に置く場合

- サブパス公開になるため、Vite の `base: '/リポジトリ名/'` を設定。
- GitHub Actions で `main` マージ時に `dist` を `gh-pages` ブランチへデプロイするワークフローをよく使う。

### 5.2 Cloudflare Pages / Netlify

- リポジトリ連携後、**ビルドコマンド** `npm run build`、**出力ディレクトリ** `dist` を指定。
- 環境変数は本プロジェクトでは原則不要（API キーなし前提）。

## 6. カスタムドメイン（任意）

- DNS で CNAME を設定し、ホスティング側でドメインを登録（各プロバイダの手順に従う）。

## 7. 継続的デリバリー（任意）

- **GitHub Actions** で `push` 時に `lint` / `test` / `build` を実行。
- プルリクエスト必須 + ブランチ保護で **壊れた main を防ぐ**。

## 8. ドキュメントとして残すもの（公開後）

- README に **公開 URL**、**ローカル起動方法**、**仕様の参照先**（本 `Note2Color_interpreter` ドキュメントへのリンク）。
