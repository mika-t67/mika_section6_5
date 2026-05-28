import { Router } from 'express'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import upload from '../middleware/upload'
import redis from '../lib/redis'
 
const router = Router()
const CACHE_KEY = 'profile'
const CACHE_TTL = 60 * 60 // 1時間
 
// GET /profile
router.get('/', async (req, res) => {
  try {
    // キャッシュ確認
    const cached = await redis.get(CACHE_KEY)
    if (cached) {
      return res.json(JSON.parse(cached))
    }
 
    const profile = await prisma.profile.findFirst()
 
    // キャッシュに保存
    if (profile) {
      await redis.set(CACHE_KEY, JSON.stringify(profile), 'EX', CACHE_TTL)
    }
 
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'プロフィールの取得に失敗しました' })
  }
})
 
// POST /profile
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
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
 
    // キャッシュ削除
    await redis.del(CACHE_KEY)
 
    res.status(201).json(profile)
  } catch (error) {
    res.status(500).json({ error: 'プロフィールの作成に失敗しました' })
  }
})
 
// PUT /profile/:id
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }
 
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
 
    // キャッシュ削除
    await redis.del(CACHE_KEY)
 
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'プロフィールの更新に失敗しました' })
  }
})
 
export default router
 