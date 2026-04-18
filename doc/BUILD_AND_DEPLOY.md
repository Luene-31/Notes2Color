# アプリ構築から公開までの流れ

前提: [TECH_STACK.md](./TECH_STACK.md) の **Vite + TypeScript + 任意フレームワーク**。パッケージマネージャは本ドキュメントでは **pnpm** を前提とする（未導入の場合は [pnpm のインストール](https://pnpm.io/installation)を参照。`corepack enable` や `npm install -g pnpm` でも可）。

## このリポジトリ（Note2Color）でのローカル開発

リポジトリをクローン済みで、ルートで次を実行します。

```bash
pnpm install
pnpm dev
```

ブラウザでは **`http://localhost:5173/Note2Color/`** を開いてください（`vite.config.ts` の `base` が `/Note2Color/` のため）。

```bash
pnpm run build    # 本番ビルド（型チェック + Vite）
pnpm preview      # dist のローカル確認（既定 http://localhost:4173/Note2Color/）
pnpm test         # Vitest
```

**GitHub Pages での公開**は、画面操作の詳細を [GITHUB_PAGES.md](./GITHUB_PAGES.md) にまとめています。リポジトリには `.github/workflows/deploy-pages.yml` があります。

---

## 1. ローカル開発環境

1. **Node.js LTS** をインストール（例: 20.x 系。プロジェクトで `.nvmrc` や `engines` を置くとよい）。
2. プロジェクト作成:

   ```bash
   pnpm create vite@latest note2color -- --template react-ts
   ```

   （テンプレートは React でなくてもよい。）

   **既にクローン済みのリポジトリ直下に置く場合**は、カレントディレクトリを指定する例:

   ```bash
   pnpm create vite@latest . -- --template react-ts
   ```

3. 依存関係インストール: `pnpm install`
4. 開発サーバ: `pnpm dev`（または `pnpm run dev`）→ ブラウザで `http://localhost:5173`（既定。`base` を設定している場合は `/リポジトリ名/` 付きの URL）
5. 本番ビルドのローカル確認: `pnpm run build` → `pnpm run preview` → 既定では `http://localhost:4173`（`dist` の内容を配信）

## 2. 実装の順序（推奨）

1. **ドメイン層**: `midi` → 音クラス、`noteToColor`（HSV→RGB）、`mixing`（加法・CMY）。**Vitest で数値テスト**。
2. **UI**: 鍵盤（選択集合）、カラーボックス、モード切替、数値表示。
3. **レスポンシブ**: メディアクエリまたはモバイルファーストのレイアウト。
4. **ビルド確認**: `pnpm run build` → `pnpm run preview` で本番相当の確認。

## 3. 品質・公開前チェック

- `pnpm run build` がエラーなく通る。
- **テスト**: Vitest を導入している場合は `pnpm run test`（または `pnpm exec vitest run`）が通る。
- 主要ブラウザで **鍵盤・混色・表示** を確認（実機のスマホ推奨）。
- アクセシビリティ: コントラスト、フォーカス可能な操作（可能なら）。

## 4. 本番ビルド

- `pnpm run build` で `dist/`（または設定した出力ディレクトリ）に静的ファイルが生成される。

## 5. デプロイ（例: GitHub Pages）

**Note2Color を初めて GitHub Pages に載せるとき**は、[GITHUB_PAGES.md](./GITHUB_PAGES.md) のステップに従うと、Settings の切り替えから公開 URL まで一通り追えます。

公式の静的デプロイ手順の一覧: [Vite — Deploying a Static Site（GitHub Pages 節）](https://vitejs.dev/guide/static-deploy.html#github-pages)

### 5.1 公開 URL の形と `base`

| サイトの種類 | 例 | Vite の `base` |
|--------------|-----|----------------|
| **ユーザ／組織サイト**（`username.github.io` リポジトリ） | `https://username.github.io/` | `base: '/'` |
| **プロジェクトサイト**（`username.github.io/リポジトリ名/`） | `https://username.github.io/Note2Color/` | `base: '/リポジトリ名/'`（**先頭・末尾に `/` を付ける**） |

サブパス公開では **`base` を間違えると CSS/JS が 404** になるため、リポジトリ名が決まったら `vite.config` と一緒に固定する。

### 5.2 デプロイのしかた（よくあるパターン）

- **GitHub Actions**: `main` へのプッシュ時に `pnpm install --frozen-lockfile` → `pnpm run build` → 生成物を **GitHub Pages** に公開（`actions/upload-pages-artifact` と `actions/deploy-pages` の組み合わせが一般的）。リポジトリの **Settings → Pages** でソースを **GitHub Actions** にする。
- **別ブランチ方式**: ビルド結果だけを **`gh-pages` ブランチ** にプッシュするワークフロー（例: `peaceiris/actions-gh-pages`）もよく使われる。**Settings → Pages** で公開ブランチを `gh-pages` / `root` に指定。

いずれも **ビルドはリポジトリのルートで実行**し、**公開するのは `dist/` の中身**（設定により `dist` 自体ではなくその子をルートとして載せる）である点は同じ。

### 5.3 Cloudflare Pages / Netlify

- リポジトリ連携後、**ビルドコマンド** `pnpm run build`、**出力ディレクトリ** `dist` を指定。
- 環境変数は本プロジェクトでは原則不要（API キーなし前提）。
- サブパスではなくルートに載せるホスティングが多いが、**カスタムドメインやサブパス**を使う場合は各サービスの「ベースパス」設定と Vite の `base` を揃える。

## 6. カスタムドメイン（任意）

- DNS で CNAME を設定し、ホスティング側でドメインを登録（各プロバイダの手順に従う）。

## 7. 継続的デリバリー（任意）

- **GitHub Actions** で `push` 時に `lint` / `test` / `build` を実行。
- プルリクエスト必須 + ブランチ保護で **壊れた main を防ぐ**。

## 8. ドキュメントとして残すもの（公開後）

- ルートの **README**: エンドユーザー向けの概要・**取り扱い説明書**（[USER_GUIDE.md](./USER_GUIDE.md)）・公開 URL の目安・仕様へのリンク。
- **開発者向け**のコマンドやビルド手順は本ファイル（BUILD_AND_DEPLOY）および [GITHUB_PAGES.md](./GITHUB_PAGES.md) に集約する。
