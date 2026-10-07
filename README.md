# abby GROUP — グループポータルサイト

abby GROUP（株式会社abby／株式会社Abby auction／株式会社Abb Solution）の
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
- 各社の公式サイトリンクのみ掲載しています（株式会社Abby auctionのリンクは未確定のため、リンクボタンは非表示）。

## 現在の機能（実装済み）

- 固定ヘッダー（スクロールで白背景に切替、モバイルはハンバーガーメニュー）
- HERO（**写真なし／黒背景＋タイポグラフィのみ**。メインコピーを主役にしたレイアウト）
- ABOUT（**写真なし／タイポグラフィ＋余白のみ**。本文を約20%削減）
- OUR BUSINESS（3事業を1画面ずつ**大きな写真1枚**で紹介／01 REUSE・02 AUCTION・03 HUMAN RESOURCES。写真側を広く確保）
- OUR VALUE CREATION（**モノ・市場・人** の3つの価値を生み出すグループとして表示／VALUE OF THINGS・VALUE OF MARKET・VALUE OF PEOPLE）
- PHILOSOPHY（**写真なし／BLACK背景**の印象的なセクション。大きなタイポグラフィ＋余白。MISSION / VISIONも同世界観の黒背景）
- GROUP COMPANIES（会社名・事業カテゴリー・VIEW WEBSITE のみのシンプル一覧）
- OUR FUTURE（**写真なし／黒背景＋タイポグラフィのみ**。大見出し＋本文＋ `REUSE × AUCTION × HUMAN RESOURCES × NEXT`）
- NEWS（**データが空の場合はセクションごと非表示**。CMS差し替えしやすいデータ構造）
- CONTACT（大見出し＋本文＋CONTACT US ボタン → /contact）
- スクロール連動のフェードイン（`prefers-reduced-motion` 対応）
- ページ遷移オーバーレイ（同一ページ内アンカーには適用しない）
- お問い合わせフォーム（/contact）＋ API（/api/contact、D1保存に対応／DB未設定でも受理）
- 404ページ、プライバシーポリシーページ（/privacy）

## ルーティング / API

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/` | トップページ（全セクション） |
| GET | `/contact` | お問い合わせフォーム |
| GET | `/privacy` | プライバシーポリシー |
| POST | `/api/contact` | お問い合わせ送信（JSON）→ D1 `contacts` テーブルへ保存 |
| — | その他 | 404ページ |

`POST /api/contact` のリクエスト例:

```json
{ "type": "事業提携", "company": "会社名", "name": "氏名", "email": "a@example.com", "message": "本文" }
```

## データ構造

- `src/index.tsx` 内の `COMPANIES` 配列 … 3事業のデータ（番号・カテゴリー・会社名・本文・画像・リンク）
- `NEWS` 配列 … ニュース項目（date / category / title / url）。**空配列のとき NEWSセクションとナビの NEWS は自動的に非表示**
- D1 テーブル `contacts` … お問い合わせ保存先（`DB` バインディング設定時のみ）

## 使用技術

- **Hono** + TypeScript（Cloudflare Pages / Workers）
- ビルド: Vite（`@hono/vite-build`）
- スタイル: 自前CSS（`public/static/style.css`）— Tailwind等は不使用
- フォント: Google Fonts（**Noto Sans JP**＝日本語本文・見出し／**Cormorant Garamond**＝英字ディスプレイ／Inter＝英字UI）
- 画像: `public/static/img/`（**各事業の実態を伝えるオリジナル生成画像3枚のみ**。AI生成）
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
│   └── img/             # 事業写真3枚（biz-reuse / biz-auction / biz-hr）
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

- **写真は3枚のみ**（各事業1枚）。1枚を大きく見せ、白／黒／グレーを基調にモノトーン加工。
- **HERO / ABOUT / PHILOSOPHY / OUR FUTURE は写真を置かず**、タイポグラフィ・余白・コントラストで構成（黒または白ベースでコピーを主役に）。
- 都市・建築・会議・抽象コーポレート・汎用オフィス写真は使用しない。各事業の実態を伝えるビジュアルのみ：
  - **REUSE**: 大理石・自然光のもとで上質な時計＋ジュエリーを撮影した商品ビジュアル
  - **AUCTION**: 手袋＋ルーペでブランドジュエリーを検品・鑑定する様子（「入札」ではなく確認・査定のニュアンス）
  - **HUMAN RESOURCES**: 現代的で洗練されたオフィスでの商談・提案・相談のシーン（汎用の会議写真は避ける）
- トーン: 無料素材感を排し、Editorial / Premium / Corporate。ゴールドは英字ラベルやドットなど**控えめなアクセント**としてのみ使用。

## タイポグラフィ / 可読性の方針

- 日本語は **Noto Sans JP**。本文 400〜500 / 16〜17px / 行間 1.9〜2.0
- 日本語の大見出しは 500〜600（細すぎるフォント・明朝・極端な letter-spacing は使用しない）
- 英字セクション見出しは **Cormorant Garamond**（上品な Serif）
- 本文の最大横幅は **約620px**（画面いっぱいに横長表示しない）
- セクション上下の余白は大きめに確保
- 写真を主役にするセクションでは、写真側を広く（`biz-inner` は 1.55 : 0.45）確保

## 未実装 / 今後の推奨

- 株式会社Abby auction の公式サイトURL確定 → `COMPANIES` の `url` を設定すると VIEW WEBSITE が自動表示されます（未設定時はボタン非表示）
- NEWSの登録 / CMS連携（`NEWS` 配列が空の間はセクション非表示。D1/KV/ヘッドレスCMSへ差し替え可能）
- お問い合わせのメール通知（Resend / SendGrid 等の外部API連携）
- 会社概要・各社詳細ページ、採用ページの追加
- OGP画像の設定（`renderer.tsx`）
- プライバシーポリシー本文の正式確定（現状は雛形）

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

---

© abby GROUP. All Rights Reserved.（`abby GROUP` はグループブランドであり法人ではありません）
