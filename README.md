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