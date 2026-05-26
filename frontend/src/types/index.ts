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
 
export type Achievement = {
  id: number
  title: string
  description: string
  imageUrl: string
  tags: string[]
  url?: string
  createdAt: string // ISO 8601
}
 
export type Contact = {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}
 