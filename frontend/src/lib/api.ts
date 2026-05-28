import axios from 'axios'
 
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
})
 
// プロフィール
export const getProfile = async () => {
  const res = await api.get('/profile')
  return res.data
}
 
export const createProfile = async (formData: FormData) => {  //画像付きデータ送信用
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
 //JSONデータ送信
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
export const getAchievements = async () => {
  const res = await api.get('/achievements')
  return res.data
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