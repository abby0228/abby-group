# abby GROUP — グループポータルサイト

abby GROUP（株式会社abby／株式会社Abby auction／株式会社Abby Solution）の
**グループポータルサイト**です。各社を詳しく説明するLPではなく、
グループ全体のブランド・信用・事業領域を伝え、各グループ会社の公式サイトへ案内することを目的としています。

## プロジェクト概要

- **名称**: abby GROUP コーポレートサイト
- **目的**:
  - abby GROUPとしてのブランドイメージの確立
  - グループ全体の事業内容を分かりやすく伝える
  - 各グループ会社への入口になる
  - 取引先・金融機関・採用候補者・事業提携先からの信用向上
- **コンセプト**: 「価値をつなぎ、可能性をひらく。」
- **デザイン**: Modern Corporate × Editorial × Business Group（モノトーン／大きな余白／大きな英字タイポ）

## 重要な前提（表現ポリシー）

- `abby GROUP` は **グループブランド** として表現しています（法人として扱いません）。
- 3社はそれぞれ **独立した法人** です。親会社・子会社・資本関係・出資比率などの関係は記載していません。
- 売上・社員数・設立年・拠点数・実績・代表者メッセージ・お客様の声などの**推測／生成は行っていません**。
- 「業界No.1」等の根拠のない表現は使用していません。
- 各社の公式サイトリンクのみ掲載しています（株式会社abby・株式会社Abby auction・株式会社Abby Solution の3社すべてリンク済み）。

## 現在の機能（実装済み）

- 固定ヘッダー（スクロールで白背景に切替、モバイルはハンバーガーメニュー）
- HERO（**写真なし／黒背景＋タイポグラフィのみ**。メインコピーを主役にしたレイアウト）
- ABOUT（**写真なし／タイポグラフィ＋余白のみ**。本文を約20%削減）
- OUR BUSINESS（3事業を1画面ずつ紹介／01 REUSE・02 AUCTION・03 HUMAN RESOURCES。**写真なし／タイポグラフィのみ**。番号＋事業カテゴリーを大きく見せ、本文で説明）
- OUR VALUE CREATION（**モノ・市場・人** の3つの価値を生み出すグループとして表示／VALUE OF THINGS・VALUE OF MARKET・VALUE OF PEOPLE）
- PHILOSOPHY（**写真なし／BLACK背景**の印象的なセクション。大きなタイポグラフィ＋余白。MISSION / VISIONも同世界観の黒背景）
- GROUP COMPANIES（会社名・事業カテゴリー・VIEW WEBSITE のみのシンプル一覧）
- OUR FUTURE（**写真なし／黒背景＋タイポグラフィのみ**。大見出し＋本文＋ `REUSE × AUCTION × HUMAN RESOURCES × NEXT`）
- FAQ（よくあるご質問。5件のQ&A。Q/Aバッジ付き。`/group` やグループ概要への導線も内包）
- NEWS（お知らせ一覧。**事実ベースの告知2件を掲載中**。`url` 省略時はリンクなしの行として表示。データが空になればセクションごと非表示。CMS差し替えしやすいデータ構造）
- CONTACT（大見出し＋本文＋CONTACT US ボタン → /contact）
- **グループ概要ページ（/group）** — 3事業一覧＋グループの成り立ち＋各社紹介（法人関係の推測は記載せず）
- **ヘッダーの GROUP COMPANIES ドロップダウン** — 3社の公式サイト＋「グループ概要を見る」への導線（モバイルは GROUP OVERVIEW リンク）
- スクロール連動のフェードイン（`prefers-reduced-motion` 対応）
- ページ遷移オーバーレイ（同一ページ内アンカーには適用しない）
- お問い合わせフォーム（/contact）＋ API（/api/contact、D1保存に対応／DB未設定でも受理）
- 404ページ、プライバシーポリシーページ（/privacy、**全10条の正式版**）
- **SEO / OGP** — canonical、og:image（1200×630 `ogp.png`）、twitter:card、robots、テーマカラー
- **構造化データ（JSON-LD）** — Organization（`sameAs` に3社公式サイト）＋ WebSite
- **robots.txt / sitemap.xml** — 動的ルートで配信（`/`・`/group`・`/contact`・`/privacy`）
- **アクセス解析の受け口** — Cloudflare Web Analytics のビーコン（トークン設定時のみ有効。`renderer.tsx` の `CF_ANALYTICS_TOKEN`）

## ルーティング / API

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/` | トップページ（全セクション） |
| GET | `/group` | グループ概要 |
| GET | `/contact` | お問い合わせフォーム |
| GET | `/privacy` | プライバシーポリシー |
| GET | `/robots.txt` | クローラ向け（Sitemap を明記） |
| GET | `/sitemap.xml` | サイトマップ（4ページ） |
| POST | `/api/contact` | お問い合わせ送信（JSON）→ D1 `contacts` テーブルへ保存 |
| — | その他 | 404ページ |

`POST /api/contact` のリクエスト例:

```json
{ "type": "事業提携", "company": "会社名", "name": "氏名", "email": "a@example.com", "message": "本文" }
```

## データ構造

- `src/index.tsx` 内の `COMPANIES` 配列 … 3事業のデータ（番号・カテゴリー・会社名・本文・リード・リンク）
- `NEWS` 配列 … ニュース項目（date / category / title / url?）。**url は省略可**（省略時はリンクなし行）。**空配列のとき NEWSセクションとナビの NEWS は自動的に非表示**
- 記載ポリシー: NEWS は**事実のみ**を記載（推測・生成した実績や数値は書かない）
- `FAQ` 配列 … よくあるご質問（q / a）
- D1 テーブル `contacts` … お問い合わせ保存先（`DB` バインディング設定時のみ）
- `renderer.tsx` の `SITE_URL` / `OGP_IMAGE` / `ORG_JSON_LD` / `CF_ANALYTICS_TOKEN` … SEO・構造化データ・解析の設定

## 使用技術

- **Hono** + TypeScript（Cloudflare Pages / Workers）
- ビルド: Vite（`@hono/vite-build`）
- スタイル: 自前CSS（`public/static/style.css`）— Tailwind等は不使用
- フォント: Google Fonts（**Noto Sans JP**＝日本語本文・見出し／**Cormorant Garamond**＝英字ディスプレイ／Inter＝英字UI）
- 画像: **サイト内に写真は一切なし**（タイポグラフィのみで構成）。唯一の画像は OGP用の `ogp.png`
- OGP画像: `public/static/ogp.png`（1200×630）
- 永続化: Cloudflare D1（お問い合わせのみ）

## ディレクトリ構成

```
webapp/
├── src/
│   ├── index.tsx        # ルーティング・ページ・コンポーネント
│   └── renderer.tsx     # HTMLシェル（meta / OGP / フォント）
├── public/static/
│   ├── style.css        # デザイン一式
│   ├── app.js           # ヘッダー・ナビ・reveal・フォーム送信
│   ├── favicon.svg
│   └── ogp.png          # OGP画像（1200×630。サイト内の唯一の画像）
├── ecosystem.config.cjs # PM2設定
├── wrangler.jsonc       # Cloudflare Pages設定
└── vite.config.ts
```

## ローカル開発

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs   # http://localhost:3000
curl http://localhost:3000
pm2 logs webapp --nostream
```

## 写真・ビジュアルの方針

- **サイト内に写真は一切使用していません**。全セクションをタイポグラフィ・余白・コントラストで構成（黒または白ベースでコピーを主役に）。
- 写真を持たないことで、Editorial / Premium / Corporate のトーンを保ちつつ、読み込みも軽量です。
- ゴールドは英字ラベルやドットなど**控えめなアクセント**としてのみ使用。
- 唯一の画像は OGP用の `ogp.png`（SNS共有時のサムネイル）のみ。

## タイポグラフィ / 可読性の方針

- 日本語は **Noto Sans JP**。本文 400〜500 / 16〜17px / 行間 1.9〜2.0
- 日本語の大見出しは 500〜600（細すぎるフォント・明朝・極端な letter-spacing は使用しない）
- 英字セクション見出しは **Cormorant Garamond**（上品な Serif）
- 本文の最大横幅は **約620px**（画面いっぱいに横長表示しない）
- セクション上下の余白は大きめに確保
- OUR BUSINESS は番号（01/02/03）と事業カテゴリーを大きく見せ、本文は `--read`（約620px）で読みやすく

## 未実装 / 今後の推奨

- **アクセス解析の有効化** — `renderer.tsx` の `CF_ANALYTICS_TOKEN` に Cloudflare Web Analytics のトークンを設定するとビーコンが有効になります（ダッシュボードでサイト追加 → トークン取得）
- **お問い合わせの実送信・メール通知** — Resend / SendGrid 等の外部API連携（現状は D1 保存または受理のみ。要望があれば別途対応）
- **NEWSの拡充** — 記事が増えたら専用 `/news` ページ（一覧＋詳細）に切り出す（現状はトップのセクションのみ）
- NEWS の CMS / D1 連携（`NEWS` 配列を D1・KV・ヘッドレスCMSへ差し替え可能）
- 各グループ会社の詳細ページ、採用ページの追加
- 多言語対応（英語版）

## デプロイ

- **プラットフォーム**: Cloudflare Pages（ご自身の Cloudflare アカウント）
- **プロジェクト名**: `abby-group`
- **ステータス**: ✅ デプロイ済み（公開中）
- **本番URL**: https://abbygroup-inc.com （独自ドメイン・Active）
  - `https://www.abbygroup-inc.com` も同一サイトを配信
  - Cloudflare Pages 既定URL: https://abby-group.pages.dev
- **DNS**（ゾーン `abbygroup-inc.com`）:
  | Type | Name | Target | Proxy |
  |---|---|---|---|
  | CNAME | `@` | `abby-group.pages.dev` | Proxied |
  | CNAME | `www` | `abby-group.pages.dev` | Proxied |
- **GitHub**: https://github.com/abby0228/abby-group
- **再デプロイ**:
  ```bash
  npm run build
  npx wrangler pages deploy dist --project-name abby-group --branch main
  ```
- **備考**: D1を利用する場合、`wrangler.jsonc` の `d1_databases` を有効化し、`DB` をバインドしてください。
- **デプロイ時の注意**: `_routes.json` が `/*` を関数へ通すため、`/robots.txt` と `/sitemap.xml` は **Hono のルート**として実装しています（`public/` 直下の静的ファイルでは配信されません）。

---

© abby GROUP. All Rights Reserved.（`abby GROUP` はグループブランドであり法人ではありません）
