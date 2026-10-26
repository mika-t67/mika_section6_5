export type Profile = {
  id: number
  name: string
  nameEn: string
  role: string
  bio: string
  avatarUrl: string
  email: string
  twitterUrl?: string
  githubUrl?: string
}

export type Skill = {
  id: number
  name: string
  category: 'frontend' | 'backend' | 'design' | 'other'
  level: 1 | 2 | 3 | 4 | 5 // 1: 入門 〜 5: 熟練
  iconUrl?: string
}

// 一覧で表示する端末の枠
export type Device = 'pc' | 'mobile'

export type Achievement = {
  id: number
  title: string
  description: string
  imageUrl: string
  imageAlt?: string | null
  tags: string[]
  url?: string

  // 一覧の表示用
  device: Device
  sortOrder: number

  // 詳細ページ用
  devType?: string | null // 個人開発 / チーム開発（人数）
  period?: string | null // 開発期間
  role?: string | null // 担当範囲
  techReason?: string | null // 技術選定の理由
  challenge?: string | null // 苦労したことと解決策
  githubUrl?: string | null

  createdAt: string // ISO 8601
}

export type Contact = {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}