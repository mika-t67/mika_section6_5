# ポートフォリオサイト

管理画面から掲載内容を編集できる、フルスタックのポートフォリオサイトです。

**🔗 デモ: https://mika-section6-5.vercel.app**

プロフィール・スキル・制作実績を管理画面から追加・編集でき、変更は公開ページに即座に反映されます。

---

## スクリーンショット

| トップページ | 管理画面 |
|---|---|
| ![トップページ](docs/screenshot-top.png) | ![管理画面](docs/screenshot-admin.png) |

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | Next.js (App Router) / TypeScript / Tailwind CSS |
| バックエンド | Express.js / Prisma |
| DB | MySQL |
| キャッシュ | Redis (本番は Valkey) |
| 認証 | Firebase Authentication / Firebase Admin SDK |
| 画像ストレージ | Cloudinary |
| 開発環境 | Docker |

---

## デプロイ構成

```
                  ┌──────────────────────────┐
   ブラウザ  ───▶  │  Vercel                  │
                  │  Next.js (フロントエンド)  │
                  └───────────┬──────────────┘
                              │ REST API
                              │ Authorization: Bearer <ID token>
                  ┌───────────▼──────────────┐
                  │  Render                  │
                  │  Express (バックエンド)    │
                  └─────┬──────────────┬─────┘
                        │              │
             ┌──────────▼───┐   ┌──────▼───────┐
             │ Aiven        │   │ Aiven        │
             │ MySQL        │   │ Valkey       │
             │ (データ永続化) │   │ (キャッシュ)   │
             └──────────────┘   └──────────────┘
```

| 役割 | サービス |
|---|---|
| フロントエンド | Vercel |
| バックエンド API | Render |
| データベース | Aiven for MySQL |
| キャッシュ | Aiven for Valkey |
| 認証基盤 | Firebase Authentication |
| 画像ホスティング | Cloudinary |

フロントエンドとバックエンドを分離した構成のため、デプロイ先も分けています。バックエンドは Redis への接続と Prisma のコネクションプールを起動時に確立して使い回す常駐サーバー型の設計のため、サーバーレスではなく常駐実行できる Render を選定しました。

---

## 実装で工夫した点

### 1. 認可はサーバー側で担保する

管理画面へのアクセス制御を3層に分けています。

| 層 | 役割 |
|---|---|
| Next.js のミドルウェア | 未ログイン時に管理画面を表示しない（UX） |
| 管理画面レイアウトのガード | 認証状態を確認してログイン画面へリダイレクト（UX） |
| **バックエンドのトークン検証** | **実際のセキュリティ境界** |

フロントエンドの表示制御は利用者側で書き換えられるため、これはあくまで UX のための仕組みと位置づけています。データを守っているのは、バックエンドで Firebase Admin SDK により ID トークンを検証する `verifyToken` ミドルウェアです。GET は公開、POST / PUT / DELETE は認証必須としています。

### 2. 認証チェックをファイルアップロードより前に置く

画像アップロードを伴うエンドポイントでは、`verifyToken` を multer より前に配置しています。

```ts
router.post('/', verifyToken, upload.single('image'), handler)
```

逆順にすると、未認証のリクエストでも最大 5MB の画像をサーバーのメモリに読み込んでから 401 を返すことになり、無駄なリソースを消費させられる余地が生まれるためです。

### 3. Redis キャッシュとフォールバック

GET のレスポンスを Redis にキャッシュし、DB への問い合わせを削減しています。

- キャッシュ有効期限は 1 時間
- 更新系の操作時にキャッシュを削除して整合性を確保
- **Redis に障害があってもエラーにせず DB にフォールバック**するため、キャッシュ層の停止がサービス停止に直結しません

本番の DB は物理的に遠いリージョンにあるため、キャッシュの効果が体感できる構成になっています。

### 4. API が停止していても正しい内容を表示する

公開ページは、API に接続できない場合に静的なフォールバックデータを表示します。このデータは実際の DB の内容から自動生成しています。

```bash
npm run generate:fallback
```

手書きのダミーデータを置くと、本番 DB が空だったり API が停止していた場合に、誤った内容が「正常に表示されているように見えてしまう」という問題があります。実データから生成することで、どの経路でも表示内容が正しくなるようにしました。

### 5. CORS のホワイトリスト化

許可するオリジンを環境変数から読み込み、カンマ区切りで複数指定できるようにしています。開発環境と本番環境で同じコードのまま、環境変数の差し替えだけで運用できます。

### 6. 管理画面の変更を即座に公開ページへ反映

公開ページは既定では静的生成され、ビルド時点のデータで固定されます。管理画面から編集した内容がすぐ反映されるよう、リクエストごとにサーバーで描画する設定にしています。

```ts
export const dynamic = 'force-dynamic'
```

---

## ローカル環境のセットアップ

### 必要なもの

- Docker Desktop
- Node.js

### 1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd mika_section6_5
```

### 2. Docker 起動（MySQL + Redis）

```bash
docker-compose up -d
```

### 3. バックエンド

```bash
cd backend
npm install
cp .env.example .env
# .env を編集して各値を設定
npx prisma migrate dev
npm run dev
```

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

# CORS で許可するオリジン（カンマ区切り）
ALLOWED_ORIGINS=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

REDIS_URL=redis://localhost:6379

# Firebase Admin SDK（サービスアカウントの秘密鍵）
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

`FIREBASE_PRIVATE_KEY` は改行を含むため、ダブルクォートで囲んだ 1 行の文字列として設定します。

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
| http://localhost:3000/admin | 管理画面（未認証時はログイン画面へ） |
| http://localhost:3000/admin/login | 管理者ログイン |
| http://localhost:3001/health | バックエンドヘルスチェック |

---

## API エンドポイント

🔒 は認証（`Authorization: Bearer <Firebase ID token>`）が必要です。

| エンドポイント | メソッド | 認証 | 説明 |
|---|---|---|---|
| `/health` | GET | | ヘルスチェック |
| `/profile` | GET | | プロフィール取得 |
| `/profile` | POST | 🔒 | プロフィール作成（画像アップロード可） |
| `/profile/:id` | PUT | 🔒 | プロフィール更新（画像アップロード可） |
| `/skills` | GET | | スキル一覧取得 |
| `/skills` | POST | 🔒 | スキル作成 |
| `/skills/:id` | PUT | 🔒 | スキル更新 |
| `/skills/:id` | DELETE | 🔒 | スキル削除 |
| `/achievements` | GET | | 実績一覧取得 |
| `/achievements` | POST | 🔒 | 実績作成（画像アップロード可） |
| `/achievements/:id` | PUT | 🔒 | 実績更新（画像アップロード可） |
| `/achievements/:id` | DELETE | 🔒 | 実績削除 |
| `/contact` | GET | 🔒 | お問い合わせ一覧取得 |
| `/contact` | POST | | お問い合わせ送信 |

お問い合わせの送信のみ、訪問者が利用するため公開しています。

---

## ディレクトリ構成

```bash
mika_section6_5/
├── frontend/
│   ├── scripts/
│   │   └── generate-fallback.mjs   # 実データからフォールバックを生成
│   └── src/
│       ├── app/
│       │   ├── (public)/           # トップ・コンタクトページ
│       │   └── (admin)/            # 管理画面
│       ├── components/
│       │   └── sections/           # 各セクションコンポーネント
│       ├── lib/
│       │   ├── api.ts              # APIクライアント（IDトークンを付与）
│       │   ├── firebase.ts         # Firebase初期設定
│       │   ├── auth.ts             # 認証ヘルパー
│       │   └── mockData.ts         # フォールバックデータ（自動生成）
│       ├── proxy.ts                # 管理画面のルート保護
│       └── types/
│           └── index.ts            # 型定義
└── backend/
    └── src/
        ├── index.ts                # エントリーポイント・CORS設定
        ├── lib/
        │   ├── prisma.ts           # PrismaClient
        │   ├── cloudinary.ts       # Cloudinary設定
        │   ├── redis.ts            # Redis設定
        │   └── firebaseAdmin.ts    # Firebase Admin SDK初期化
        ├── middleware/
        │   ├── auth.ts             # IDトークン検証
        │   └── upload.ts           # multerミドルウェア
        ├── routes/
        │   ├── profile.ts
        │   ├── skills.ts
        │   ├── achievements.ts
        │   └── contact.ts
        └── scripts/
            └── copy-to-production.ts  # 本番DBへのデータ移行
```

---

## キャッシュの確認方法

```bash
# キャッシュの中身を確認
docker exec -it portfolio_redis redis-cli GET profile

# キャッシュをリセット
docker exec -it portfolio_redis redis-cli FLUSHALL
```

---

## 今後の改善予定

- お問い合わせ一覧の管理画面（API は認証付きで実装済み）
- DB 接続時の TLS 証明書の厳密な検証
- テストコードの追加