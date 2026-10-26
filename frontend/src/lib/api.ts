import axios from 'axios'
import type { Achievement } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  // APIが返事をしないときは10秒で諦める（呼び出し側で予備データに切り替える）
  timeout: 10000,
})

// リクエスト前にIDトークンを付与する
// ブラウザでのみ実行（サーバーコンポーネントからのGETはトークン不要）
api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config

  const { getIdToken } = await import('@/lib/auth')
  const token = await getIdToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// プロフィール
export const getProfile = async () => {
  const res = await api.get('/profile')
  return res.data
}

export const createProfile = async (formData: FormData) => {
  const res = await api.post('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const updateProfile = async (id: number, formData: FormData) => {
  const res = await api.put(`/profile/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// スキル
export const getSkills = async () => {
  const res = await api.get('/skills')
  return res.data
}

export const createSkill = async (data: { name: string; category: string; level: number }) => {
  const res = await api.post('/skills', data)
  return res.data
}

export const updateSkill = async (id: number, data: { name: string; category: string; level: number }) => {
  const res = await api.put(`/skills/${id}`, data)
  return res.data
}

export const deleteSkill = async (id: number) => {
  const res = await api.delete(`/skills/${id}`)
  return res.data
}

// 実績
// APIはタグをカンマ区切りの文字列で返すので、受け取った直後に配列へそろえる
type AchievementResponse = Omit<Achievement, 'tags'> & {
  tags: string | string[] | null
}

const toTagArray = (tags: AchievementResponse['tags']): string[] => {
  if (Array.isArray(tags)) return tags
  return (tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

const normalizeAchievement = (raw: AchievementResponse): Achievement => ({
  ...raw,
  tags: toTagArray(raw.tags),
})

export const getAchievements = async (): Promise<Achievement[]> => {
  const res = await api.get<AchievementResponse[]>('/achievements')
  return res.data.map(normalizeAchievement)
}

export const getAchievement = async (id: number): Promise<Achievement> => {
  const res = await api.get<AchievementResponse>(`/achievements/${id}`)
  return normalizeAchievement(res.data)
}

export const createAchievement = async (formData: FormData) => {
  const res = await api.post('/achievements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const updateAchievement = async (id: number, formData: FormData) => {
  const res = await api.put(`/achievements/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const deleteAchievement = async (id: number) => {
  const res = await api.delete(`/achievements/${id}`)
  return res.data
}

// お問い合わせ
export const getContacts = async () => {
  const res = await api.get('/contact')
  return res.data
}

export const createContact = async (data: { name: string; email: string; message: string }) => {
  const res = await api.post('/contact', data)
  return res.data
}