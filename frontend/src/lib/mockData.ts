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
  "bio": "エンジニアスクールでフルスタック開発を学習しています。\r\nNext.js / Express.js / Prisma / MySQL / Firebase を使用し、\r\n管理画面付きのWebアプリケーション開発に取り組んでいます。",
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
    "id": 8,
    "name": "Figma",
    "category": "design",
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
  }
]

export const mockAchievements: Achievement[] = [
  {
    "id": 3,
    "title": "ポートフォリオサイト",
    "description": "Next.js + Tailwind CSS で制作した自身のポートフォリオ",
    "imageUrl": "https://res.cloudinary.com/ds4flierp/image/upload/v1780019085/portfolio/achievements/lhk204vbvbyaiojtokzp.png",
    "imageAlt": "",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS"
    ],
    "device": "pc",
    "sortOrder": 0,
    "devType": null,
    "period": null,
    "role": null,
    "techReason": null,
    "challenge": null,
    "githubUrl": null,
    "createdAt": "2026-05-29"
  },
  {
    "id": 2,
    "title": "家計簿アプリ",
    "description": "収支の記録・管理ができるフルスタックWebアプリケーション",
    "imageUrl": "https://res.cloudinary.com/ds4flierp/image/upload/v1780018850/portfolio/achievements/vbannhvioiuv5i4pawah.png",
    "imageAlt": "",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "SWR",
      "Node.js",
      "Express.js",
      "Prisma"
    ],
    "device": "pc",
    "sortOrder": 0,
    "devType": null,
    "period": null,
    "role": null,
    "techReason": null,
    "challenge": null,
    "githubUrl": null,
    "createdAt": "2026-05-29"
  }
]
