import { Profile, Skill, Achievement } from '@/types'

// このファイルは scripts/generate-fallback.mjs による自動生成です。
// APIに接続できない場合／データが0件の場合の表示内容として使われます。
// 内容を更新するには、バックエンドを起動した状態で次を実行してください:
//   npm run generate:fallback

export const mockProfile: Profile = {
  "id": 1,
  "name": "高橋 美香",
  "nameEn": "Mika Takahashi",
  "role": "",
  "bio": "Web Engineer Portfolio\r\n\r\n保育士・幼稚園教諭として7年間勤務した後、\r\nエンジニアスクールでフルスタック開発を学びました。\r\n\r\nNext.js / React / TypeScript / Express.js を用いた\r\nWebアプリケーション開発を経験しています。",
  "avatarUrl": "https://res.cloudinary.com/ds4flierp/image/upload/v1779966277/portfolio/avatar/vhysqu0highcoofw7tvm.png",
  "email": "myanmm.2525@gmail.com"
}

export const mockSkills: Skill[] = [
  {
    "id": 1,
    "name": "React",
    "category": "frontend",
    "level": 3
  },
  {
    "id": 2,
    "name": "Next.js",
    "category": "frontend",
    "level": 3
  },
  {
    "id": 3,
    "name": "TypeScript",
    "category": "frontend",
    "level": 3
  },
  {
    "id": 4,
    "name": "Tailwind CSS",
    "category": "frontend",
    "level": 3
  },
  {
    "id": 5,
    "name": "Node.js",
    "category": "backend",
    "level": 3
  },
  {
    "id": 6,
    "name": "Prisma",
    "category": "backend",
    "level": 3
  },
  {
    "id": 9,
    "name": "MySQL",
    "category": "backend",
    "level": 3
  },
  {
    "id": 10,
    "name": "Express.js",
    "category": "backend",
    "level": 3
  },
  {
    "id": 11,
    "name": "Docker",
    "category": "other",
    "level": 3
  },
  {
    "id": 12,
    "name": "Git",
    "category": "other",
    "level": 3
  },
  {
    "id": 13,
    "name": "Redis",
    "category": "backend",
    "level": 3
  },
  {
    "id": 14,
    "name": "Firebase",
    "category": "other",
    "level": 3
  },
  {
    "id": 15,
    "name": "Cloudinary",
    "category": "other",
    "level": 3
  },
  {
    "id": 20,
    "name": "FastAPI",
    "category": "backend",
    "level": 3
  },
  {
    "id": 21,
    "name": "PostgreSQL",
    "category": "backend",
    "level": 3
  },
  {
    "id": 22,
    "name": "AWS Lambda",
    "category": "backend",
    "level": 3
  },
  {
    "id": 23,
    "name": "Canva",
    "category": "other",
    "level": 3
  }
]

export const mockAchievements: Achievement[] = [
  {
    "id": 8,
    "title": "ポートフォリオサイト",
    "description": "企画・デザインからデプロイ\r\n\r\n・公開ページ：Canvaでデザインし、Next.jsで実装\r\n・管理画面：プロフィール・スキル・作品を画面から編集\r\n・API：Express.js + Prisma、画像はCloudinaryに保存\r\n・認証：Firebase Auth、更新系APIはサーバー側でトークン検証\r\n・デプロイ：Vercel / Render / Aiven",
    "imageUrl": "https://res.cloudinary.com/ds4flierp/image/upload/v1793063329/portfolio/achievements/z0eaugfi0al6hkfqo1u1.png",
    "imageAlt": "",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Express.js",
      "Prisma",
      "MySQL",
      "Redis",
      "Firebase Auth"
    ],
    "device": "pc",
    "sortOrder": 1,
    "devType": "個人開発",
    "period": "1ヵ月、10月にデザインリニューアル",
    "role": null,
    "techReason": "・Next.js：ページごとに表示速度とデータの新しさを調整できるため\r\n・Express.js + Prisma：APIの仕組みを理解するため、\r\n　フロントと分けて構築。Prismaの型でDBを安全に扱える\r\n・Redis：取得結果をキャッシュし、DBへのアクセスを減らすため\r\n・Firebase Auth：パスワードを自前で管理せず、安全にログインを実装するため",
    "challenge": "■ 管理画面の更新がトップページに反映されない\r\nページを60秒ごとに裏で作り直す設定にし、表示の速さと更新の反映を両立\r\n\r\n■ APIが止まるとページが表示されない\r\n10秒で応答がなければ、予備データで表示する仕組みを追加\r\n\r\n■ 本番DBを安全に更新する\r\n手元で確認してから、リセットしないコマンドで本番に反映。実行前に接続先を必ず確認",
    "githubUrl": null,
    "createdAt": "2026-08-04"
  },
  {
    "id": 7,
    "title": "BETSUBARA",
    "description": "飲食店のテーブルにあるQRコードから、一人ずつ自分の分を支払えるサービス。\r\n割り勘の計算や立て替えの手間をなくす。",
    "imageUrl": "https://res.cloudinary.com/ds4flierp/image/upload/v1785806109/portfolio/achievements/mtukvgoknbcslqvh7mom.png",
    "imageAlt": "BETSUBARAのスクリーンショット",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "AWS Lambda",
      "API Gateway",
      "LINE Messaging API",
      "sunabar API"
    ],
    "device": "mobile",
    "sortOrder": 2,
    "devType": "チーム開発：３人",
    "period": "3日",
    "role": "主に決済まわりの画面と、デザインを担当\r\n\r\n・画面：注文の選択、支払い内容の確認、支払い完了の3画面\r\n・デザイン：ロゴとブランドイメージの作成\r\n・資料：画面設計書の作成、発表用スライドの作成\r\n・進め方：featureブランチ → develop → PRで共有",
    "techReason": "・Next.js + Tailwind CSS：3日間の短期間でも、画面を素早く作れるため\r\n・AWS Lambda + API Gateway：サーバーを常に動かさず、必要なときだけ処理を実行できるため\r\n・sunabar API：銀行APIの検証環境で、実際の決済に近い流れを試せるため\r\n・LINE Messaging API：普段使っているLINEで、支払いの通知を受け取れるようにするため",
    "challenge": "■ LINE botが応答を返さない\r\n非同期処理の完了を待たずに処理が終わっていたため、\r\nPromiseで包んで完了を待つ形に修正\r\n\r\n■ AWSで権限エラーが出る\r\nIAMの権限設定を見直し、必要な権限を付与して解決\r\n\r\n■ 3日間で完成させる\r\n画面ごとに担当を分け、ブランチを分けて並行して開発",
    "githubUrl": null,
    "createdAt": "2026-08-04"
  },
  {
    "id": 6,
    "title": "Scanly",
    "description": "書類を撮影して読み取り、期限を管理しながら家族で共有できるWebアプリ。\r\nカレンダーで提出期限をひと目で確認できる。",
    "imageUrl": "https://res.cloudinary.com/ds4flierp/image/upload/v1785806031/portfolio/achievements/dl8k53cxctlbfrr6ar9f.png",
    "imageAlt": "Scanlyのスクリーンショット",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "FullCalendar",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Cloudinary",
      "SendGrid",
      "Docker"
    ],
    "device": "mobile",
    "sortOrder": 3,
    "devType": "チーム開発：4人",
    "period": "1ヵ月",
    "role": "フロントエンドの全画面を担当\r\n\r\n・画面：カレンダー、書類一覧、書類の詳細・編集、撮影内容の確認、設定、通知\r\n・共通部品：確認モーダル、画像の拡大表示、期限バッジなどを部品化\r\n・進め方：イシューを作ってから実装し、featureブランチ → develop へPR→マージ",
    "techReason": "・Next.js（App Router）+ Tailwind CSS：スマホで使う画面を、部品を組み合わせて効率よく作れるため\r\n・FullCalendar：期限をカレンダーで表示する機能を、短期間で実装できるため\r\n・FastAPI + PostgreSQL：チームでバックエンドをPythonで構築するため\r\n・Cloudinary：撮影した書類の画像を、安全に保存・配信するため\r\n・SendGrid：提出期限が近づいたら、メールでお知らせするため",
    "challenge": "■ 画面数が多く、見た目や操作がばらつく\r\n確認モーダルや画像の拡大表示などを共通部品にまとめ、全画面で同じ動きにそろえた\r\n\r\n■ スマホでの使いにくさ\r\n発表後にもらったフィードバックをイシューに分けて整理し、一つずつ改善",
    "githubUrl": null,
    "createdAt": "2026-08-04"
  },
  {
    "id": 2,
    "title": "家計簿アプリ",
    "description": "収支の記録・カテゴリ管理・予算管理ができる家計簿アプリ\r\nグラフで月ごとの収支やカテゴリ別の内訳を確認できる",
    "imageUrl": "https://res.cloudinary.com/ds4flierp/image/upload/v1780018850/portfolio/achievements/vbannhvioiuv5i4pawah.png",
    "imageAlt": "",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "SWR",
      "Recharts",
      "Express.js",
      "Prisma",
      "MySQL",
      "Vitest",
      "Playwright"
    ],
    "device": "pc",
    "sortOrder": 4,
    "devType": "個人開発",
    "period": "2週間",
    "role": "設計から実装・テストまで、すべて一人で担当\r\n\r\n・画面：収支の登録・編集、月別の一覧、カテゴリ管理、予算管理、グラフ\r\n・API：Express.js + Prisma でREST APIを作成\r\n・テスト：Vitestで単体テスト、PlaywrightでE2Eテスト、カバレッジ計測\r\n・進め方：機能ごとにGitHubのイシューを作り、ブランチとPRで管理",
    "techReason": "・SWR：データの取得とキャッシュをまとめて扱え、登録後の画面更新もシンプルに書けるため\r\n・Recharts：Reactのコンポーネントとしてグラフを組み立てられるため\r\n・Vitest：TypeScriptとの相性がよく、テストを高速に実行できるため\r\n・Playwright：実際のブラウザで、ユーザーの操作どおりに動くか確認するため",
    "challenge": "■ ReactからNext.jsへの移行\r\nページをApp Routerの構成に合わせて作り直し、\r\nデータ取得をSWRのカスタムフックにまとめた\r\n\r\n■ モックAPIからExpress.jsのAPIへの切り替え\r\n先にAPI設計書を作り、画面側の変更を最小限にして差し替えた\r\n\r\n■ ESLint v9で設定が読み込まれない\r\n新しい設定形式（flat config）に書き換え、\r\nPrismaの自動生成ファイルを対象外にした",
    "githubUrl": null,
    "createdAt": "2026-05-29"
  }
]
