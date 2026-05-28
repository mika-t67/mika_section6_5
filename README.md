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

---

## バックエンドAPI（issue #8）

### 使用技術
- Express + Prisma + MySQL
- Cloudinary（画像アップロード）
- multer（ファイル受け取り）

### ディレクトリ構成
```
backend/src/
├── index.ts              # エントリーポイント・ルーティング登録
├── lib/
│   ├── prisma.ts         # PrismaClient共通化
│   └── cloudinary.ts     # Cloudinary初期設定
├── middleware/
│   └── upload.ts         # multer画像アップロードミドルウェア
└── routes/
    ├── profile.ts        # GET/POST/PUT /profile
    ├── skills.ts         # GET/POST/PUT/DELETE /skills
    └── achievements.ts   # GET/POST/PUT/DELETE /achievements
```

### 環境変数（.env）
```
DATABASE_URL=mysql://root:password@localhost:3306/portfolio_db
PORT=3001
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 動作確認
```bash
# ルートディレクトリで（MySQL起動）
docker-compose up -d

# backendディレクトリで
cd backend
npm run dev
```

| エンドポイント | メソッド | 説明 |
|---|---|---|
| /health | GET | ヘルスチェック |
| /profile | GET | プロフィール取得 |
| /profile | POST | プロフィール作成（画像アップロード可） |
| /profile/:id | PUT | プロフィール更新（画像アップロード可） |
| /skills | GET | スキル一覧取得 |
| /skills | POST | スキル作成 |
| /skills/:id | PUT | スキル更新 |
| /skills/:id | DELETE | スキル削除 |
| /achievements | GET | 実績一覧取得 |
| /achievements | POST | 実績作成（画像アップロード可） |
| /achievements/:id | PUT | 実績更新（画像アップロード可） |
| /achievements/:id | DELETE | 実績削除 |


### 確認方法
```bash
curl http://localhost:3001/health
# → {"status":"ok"}

curl http://localhost:3001/skills
# → []（初期状態は空配列）
```
---

## Redisキャッシュ（issue #10）

### やったこと
- `docker-compose.yml` に Redis（redis:7-alpine）を追加
- `src/lib/redis.ts` 作成（ioredis）
- profile・skills・achievements の GET にキャッシュ追加
- POST・PUT・DELETE 時にキャッシュ削除

### キャッシュの仕組み
```
1回目: リクエスト → DBから取得 → Redisに保存 → レスポンス
2回目以降: リクエスト → Redisから返す（DBアクセスなし）
```
キャッシュの有効期限: 1時間（3600秒）

### 確認方法
```bash
# キャッシュの中身を確認
docker exec -it portfolio_redis redis-cli GET profile

# キャッシュをリセット
docker exec -it portfolio_redis redis-cli FLUSHALL
```

### 詰まった点・解決策
- Redis起動直後に `ECONNREFUSED` エラー → 起動タイミングのズレで一時的なもの、`Redis connected` が出れば正常
- `docker-compose up -d` で Redis が起動しない → `docker-compose.yml` の保存が反映されていなかったため再保存して解決