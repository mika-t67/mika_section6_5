# ポートフォリオサイト

管理画面付きのポートフォリオサイトです。

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | Next.js (App Router) / TypeScript / Tailwind CSS |
| バックエンド | Express.js / Prisma |
| DB | MySQL |
| キャッシュ | Redis |
| 認証 | Firebase Auth |
| 画像ストレージ | Cloudinary |
| インフラ | Docker |

---

## セットアップ

### 必要なもの

- Docker Desktop
- Node.js

---

### 1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd mika_section6_5
```

---

### 2. Docker起動（MySQL + Redis）

```bash
docker-compose up -d
```

---

### 3. バックエンド

```bash
cd backend

npm install

cp .env.example .env

# .env を編集して各値を設定

npx prisma migrate dev

npm run dev
```

---

### 4. フロントエンド

```bash
cd frontend

npm install

cp .env.local.example .env.local

# .env.local を編集して各値を設定

npm run dev
```

---

## 環境変数

### backend/.env

```env
DATABASE_URL=mysql://root:password@localhost:3306/portfolio_db
PORT=3001

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

REDIS_URL=redis://localhost:6379
```

---

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3001

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 動作確認

| URL | 説明 |
|---|---|
| http://localhost:3000 | トップページ |
| http://localhost:3000/contact | お問い合わせページ |
| http://localhost:3000/admin | 管理画面（未認証時404） |
| http://localhost:3000/admin/login | 管理者ログイン |
| http://localhost:3001/health | バックエンドヘルスチェック |

---

## バックエンド APIエンドポイント

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/health` | GET | ヘルスチェック |
| `/profile` | GET | プロフィール取得 |
| `/profile` | POST | プロフィール作成（画像アップロード可） |
| `/profile/:id` | PUT | プロフィール更新（画像アップロード可） |
| `/skills` | GET | スキル一覧取得 |
| `/skills` | POST | スキル作成 |
| `/skills/:id` | PUT | スキル更新 |
| `/skills/:id` | DELETE | スキル削除 |
| `/achievements` | GET | 実績一覧取得 |
| `/achievements` | POST | 実績作成（画像アップロード可） |
| `/achievements/:id` | PUT | 実績更新（画像アップロード可） |
| `/achievements/:id` | DELETE | 実績削除 |

---

## ディレクトリ構成

```bash
mika_section6_5/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (public)/         # トップ・コンタクトページ
│       │   └── (admin)/          # 管理画面
│       ├── components/
│       │   └── sections/         # 各セクションコンポーネント
│       ├── lib/
│       │   ├── api.ts            # APIクライアント
│       │   ├── firebase.ts       # Firebase初期設定
│       │   ├── auth.ts           # 認証ヘルパー
│       │   └── mockData.ts       # モックデータ（フォールバック用）
│       └── types/
│           └── index.ts          # 型定義
└── backend/
    └── src/
        ├── index.ts              # エントリーポイント
        ├── lib/
        │   ├── prisma.ts         # PrismaClient
        │   ├── cloudinary.ts     # Cloudinary設定
        │   └── redis.ts          # Redis設定
        ├── middleware/
        │   └── upload.ts         # multerミドルウェア
        └── routes/
            ├── profile.ts
            ├── skills.ts
            └── achievements.ts
```

---

## Redisキャッシュ

GETリクエストのレスポンスをRedisにキャッシュし、DBへの負荷を軽減しています。

- キャッシュ有効期限: 1時間
- POST・PUT・DELETE 時にキャッシュを削除してデータ整合性を確保
- Redis障害時はDBにフォールバック

---

### キャッシュ操作

```bash
# キャッシュの中身を確認
docker exec -it portfolio_redis redis-cli GET profile

# キャッシュをリセット
docker exec -it portfolio_redis redis-cli FLUSHALL
```