# GitHub Pages で Note2Color を公開する（ステップバイステップ）

このリポジトリは [Vite](https://vitejs.dev/) でビルドした **静的ファイル** をそのまま公開する想定です。公開 URL は **プロジェクトサイト** の形になります。

`https://<あなたのGitHubユーザー名>.github.io/Note2Color/`

`<あなたのGitHubユーザー名>` は実際のアカウント名に読み替えてください。リポジトリ名が `Note2Color` でない場合は、`vite.config.ts` の `base` もリポジトリ名に合わせて変更する必要があります（詳しくは [BUILD_AND_DEPLOY.md](./BUILD_AND_DEPLOY.md) の「公開 URL の形と base」）。

---

## 前提

- GitHub 上に **このリポジトリ**（例: `Note2Color`）がある。
- 既定ブランチ名は **`main`** である（別名の場合は、後述のワークフローや設定のブランチ名を読み替える）。

---

## 手順概要

1. リポジトリに **GitHub Actions 用のワークフロー**（ビルド → `dist` を Pages に載せる）が含まれていることを確認する。  
2. GitHub の **Settings → Pages** で、ソースを **GitHub Actions** にする。  
3. **`main` にプッシュ**すると自動でビルド・公開が走る。  
4. 数分待ち、公開 URL にアクセスする。

以下、画面の操作を順に追います。

---

## ステップ 1: ワークフローファイルをリポジトリに含める

リポジトリのルートに次のファイルがあることを確認します。

`.github/workflows/deploy-pages.yml`

（このリポジトリではテンプレートとして同梱されています。）

- `main` ブランチへのプッシュでビルドが走り、成果物の `dist` が GitHub Pages にデプロイされます。
- パッケージマネージャは **pnpm**（`pnpm-lock.yaml` 利用）を前提としています。

まだローカルにしか無い場合は、コミットして GitHub に **push** してください。

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "Add GitHub Pages deploy workflow"
git push origin main
```

---

## ステップ 2: GitHub で Pages のソースを「GitHub Actions」にする

1. GitHub で対象リポジトリ（`Note2Color`）を開く。
2. **Settings**（設定）を開く。
3. 左メニューから **Pages** を選ぶ。
4. **Build and deployment** の **Source** で、**GitHub Actions** を選ぶ。  
   - 以前 **Deploy from a branch** になっていた場合は、必ず **GitHub Actions** に切り替える。

この設定だけではまだサイトは出ません。次のステップでワークフローが走る必要があります。

---

## ステップ 3: ワークフローを実行する

次のいずれかで **Actions タブにワークフローが表示され、実行**されれば OK です。

- **A.** `main` に新しいコミットを push する（推奨）。
- **B.** すでにワークフローが入っている状態で、**Actions** タブから該当ワークフローを **Run workflow** する（手動実行が有効な場合）。

1. リポジトリの **Actions** タブを開く。
2. 左の **Deploy to GitHub Pages**（ワークフロー名は YAML の `name` に依存）を選ぶ。
3. 最新の実行が **緑のチェック** で完了していればデプロイ成功です。失敗した場合はログを開き、ビルドエラー（TypeScript、依存関係など）を修正します。

初回は **Settings → Pages** に「Your site is live at …」のような表示が出るまで **1〜10 分程度** かかることがあります。

---

## ステップ 4: 公開 URL を開く

1. **Settings → Pages** に戻る。  
   **Visit site** または表示されている **URL**（`https://<ユーザー名>.github.io/Note2Color/`）をクリックする。  
2. またはブラウザのアドレスバーに、次を直接入力する。

   `https://<ユーザー名>.github.io/Note2Color/`

**真っ白・404・CSS が当たらない**場合は、次を確認してください。

- `vite.config.ts` の `base` が **`/Note2Color/`**（リポジトリ名と一致、先頭・末尾スラッシュ）になっているか。
- 開いている URL が **`…/Note2Color/`**（プロジェクトサイト）になっているか。リポジトリ名違いだとパスも変わります。

---

## ステップ 5（任意）: 今後の更新

`main` にマージ・push するたびに、同じワークフローで再ビルド・再公開されます。特に Pages の設定を触り直す必要はありません。

---

## うまくいかないとき

| 状況 | 確認すること |
|------|----------------|
| Actions が失敗する | 該当 run のログで `pnpm install` / `pnpm run build` のエラー内容を確認。ローカルで `pnpm install` と `pnpm run build` が通るかも確認。 |
| 404 やアセット欠落 | `base` と実際の URL のパス（`/Note2Color/`）が一致しているか。 |
| 古いサイトが表示される | ブラウザのスーパーリロード、数分待ってから再読み込み。 |

より一般的な説明（ブランチ方式や `base` の表）は [BUILD_AND_DEPLOY.md](./BUILD_AND_DEPLOY.md) も参照してください。
