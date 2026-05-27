# mika_section6_5 ポートフォリオサイト

## 技術スタック
- フロントエンド: Next.js (App Router) + TypeScript + Tailwind CSS
- バックエンド: NestJS or Express + Prisma
- DB: MySQL or PostgreSQL
- 認証: Firebase Auth

## セットアップ

### フロントエンド
```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local にFirebaseの値を設定する
npm run dev
```

### 環境変数
`.env.local.example` を参考に `.env.local` を作成してください。

---

## バックエンドセットアップ

### 必要なもの

- Docker

### 手順

```bash
# ルートで実行（MySQL起動）
docker-compose up -d

cd backend
npm install
cp .env.example .env
```

`.env` の `DATABASE_URL` を確認する

```bash
# マイグレーション実行
npx prisma migrate dev

# サーバー起動
npm run dev
```

### 動作確認

`http://localhost:3001/health` で `{"status":"ok"}` が返ればOK

### ⚠️ 注意
- `docker-compose up -d` でMySQLが**完全に起動してから**マイグレーションを実行してください
- `backend/.env` の `DATABASE_URL` が以下と一致していることを確認してください
  - ホスト: `localhost`
  - ポート: `3306`
  - DB名: `portfolio_db`
  - ユーザー・パスワード: `docker-compose.yml` の設定と同じ
- MySQLの起動確認は `docker ps` で `portfolio_db` が `Up` になっていることを確認

---

## トップページ（issue #4）

### 構成
- `src/types/index.ts` — 型定義（Profile / Skill / Achievement / Contact）
- `src/lib/mockData.ts` — モックデータ
- `src/app/(public)/page.tsx` — トップページ
- `src/components/sections/` — 各セクションコンポーネント

### 確認方法
http://localhost:3000 でトップページを確認

---

## Firebase認証（issue #7）

### 必要な環境変数（.env.local）
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

### 確認方法
- http://localhost:3000/admin にアクセス → ログインページにリダイレクト
- ログイン成功 → ダッシュボードに遷移
- サイドバーのログアウトボタンでログアウト