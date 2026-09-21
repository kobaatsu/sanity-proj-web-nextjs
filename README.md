# web-nextjs

[`web`](../web) (Astro) と比較するために作成した Next.js 版フロントエンドです。同じ Sanity データセット（`companyInfo` / `news`）を参照し、同等のページ構成を実装しています。

- フレームワーク: Next.js (App Router, Server Components)
- スタイリング: Tailwind CSS
- データ取得: `@sanity/client` + GROQ（`defineQuery`）
- 型安全性: Sanity TypeGen（`sanity.types.ts`、生成物）

## ページ構成

| パス             | 内容                                                |
| ---------------- | --------------------------------------------------- |
| `/`              | トップページ（confetti ボタン、各ページへのリンク） |
| `/markdown-page` | MDX ページ                                          |
| `/company`       | 企業情報（`companyInfo` ドキュメント）              |
| `/news`          | お知らせ一覧（`news` ドキュメント）                 |
| `/news/[slug]`   | お知らせ詳細（Portable Text 本文）                  |

## セットアップ

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開いて確認できます。

## Sanity の型を再生成する

`studio/schemaTypes` を変更した場合は、以下を実行して `schema.json` と `sanity.types.ts` を更新してください。

```bash
pnpm typegen
```

`schema.json` は `../studio/schema.json` からコピーした生成物のため、Studio 側で `sanity schemas extract` を実行済みであることが前提です。

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity + Next.js Integration Guide](https://www.sanity.io/docs/nextjs)
