This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## フロント・バックエンド繋ぎ込み（issue #9）

### やったこと
- フロントエンドAPIクライアント作成（`src/lib/api.ts`）
- トップページをモックデータ → APIデータに切り替え
- 管理画面（プロフィール・スキル・実績）をAPIと繋ぎ込み
- 画像アップロード（Cloudinary）の動作確認
- 未認証時404対応（`src/proxy.ts`）
- フッターに管理者ログインリンク追加
- トップページのデザイン修正（セクションごとの背景色・フォント）

### 詰まった点・解決策
- `next/image` で Cloudinary の画像が表示されない → `next.config.ts` に `remotePatterns` を追加して解決
- `work.tags.map is not a function` エラー → DBからカンマ区切り文字列で返ってくるため `split(',')` で配列に変換して解決
- `middleware.ts` が Next.js 16系で非推奨 → `proxy.ts` にリネームしエクスポート名を `proxy` に変更して解決
- 画像URLが空の場合に `next/image` がエラー → `imageUrl` が空のとき `No Image` を表示するよう条件分岐して解決

### 確認方法
```bash
# ルートディレクトリで（MySQL起動）
docker-compose up -d

# backendディレクトリで
cd backend && npm run dev

# 別ターミナルでfrontendディレクトリで
cd frontend && npm run dev
```

- http://localhost:3000 → トップページ（APIデータ表示）
- http://localhost:3000/admin → 未認証時404
- http://localhost:3000/admin/login → ログインページ
- http://localhost:3000/admin/profile → プロフィール編集・画像アップロード確認

### 完了条件の確認
- トップページにAPIデータが表示される ✅
- 管理画面からプロフィール・スキル・実績を更新できる ✅
- 画像アップロードしてトップページに反映される ✅
- 未認証ユーザーが `/admin` にアクセスすると404 ✅
- フッターの管理者ログインリンクからログインできる ✅

---