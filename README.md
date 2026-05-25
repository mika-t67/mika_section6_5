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