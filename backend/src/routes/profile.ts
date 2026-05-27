import { Router } from 'express'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import upload from '../middleware/upload'
 
const router = Router()
 
// GET /profile
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst()
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'プロフィールの取得に失敗しました' })
  }
})
 
// POST /profile
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    // ① プロフィールは1件のみ
    const existing = await prisma.profile.findFirst()
    if (existing) {
      return res.status(400).json({ error: 'プロフィールは既に存在します' })
    }
 
    const { name, nameEn, role, bio, email, githubUrl, twitterUrl } = req.body
    let avatarUrl: string | undefined
 
    if (req.file) {
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'portfolio/avatar' },
          (error, result) => {
            if (error || !result) reject(error)
            else resolve(result.secure_url)
          }
        ).end(req.file!.buffer)
      })
      avatarUrl = result
    }
 
    const profile = await prisma.profile.create({
      data: { name, nameEn, role, bio, email, githubUrl, twitterUrl, avatarUrl },
    })
    res.status(201).json(profile)
  } catch (error) {
    res.status(500).json({ error: 'プロフィールの作成に失敗しました' })
  }
})
 
// PUT /profile/:id
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    // ② ID validation
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }
 
    // ③ 存在確認
    const existing = await prisma.profile.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'プロフィールが存在しません' })
    }
 
    const { name, nameEn, role, bio, email, githubUrl, twitterUrl } = req.body
    let avatarUrl: string | undefined
 
    if (req.file) {
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'portfolio/avatar' },
          (error, result) => {
            if (error || !result) reject(error)
            else resolve(result.secure_url)
          }
        ).end(req.file!.buffer)
      })
      avatarUrl = result
    }
 
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        name, nameEn, role, bio, email, githubUrl, twitterUrl,
        ...(avatarUrl && { avatarUrl }),
      },
    })
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'プロフィールの更新に失敗しました' })
  }
})
 
export default router
 