import { Router } from 'express'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import upload from '../middleware/upload'
 
const router = Router()
 
// GET /achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(achievements)
  } catch (error) {
    res.status(500).json({ error: '実績の取得に失敗しました' })
  }
})
 
// POST /achievements
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags, url, imageAlt } = req.body
    let imageUrl: string | undefined
 
    //画像が送られてきた場合だけ実行
    if (req.file) {
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'portfolio/achievements' },
          (error, result) => {
            if (error || !result) reject(error)
            else resolve(result.secure_url)
          }
        ).end(req.file!.buffer)
      })
      imageUrl = result
    }
 
    //DB保存 Achievement 作成
    const achievement = await prisma.achievement.create({
      data: { title, description, tags, url, imageUrl, imageAlt },
    })
    res.status(201).json(achievement)
  } catch (error) {
    res.status(500).json({ error: '実績の作成に失敗しました' })
  }
})
 
// PUT /achievements/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    // ID validation
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }
 
    // 存在確認
    const existing = await prisma.achievement.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: '実績が存在しません' })
    }
 
    const { title, description, tags, url, imageAlt } = req.body
    let imageUrl: string | undefined
 
    if (req.file) {
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'portfolio/achievements' },
          (error, result) => {
            if (error || !result) reject(error)
            else resolve(result.secure_url)
          }
        ).end(req.file!.buffer)
      })
      imageUrl = result
    }
 
    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        title, description, tags, url, imageAlt,
        ...(imageUrl && { imageUrl }),
      },
    })
    res.json(achievement)
  } catch (error) {
    res.status(500).json({ error: '実績の更新に失敗しました' })
  }
})
 
// DELETE /achievements/:id
router.delete('/:id', async (req, res) => {
  try {
    // ID validation
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }
 
    // 存在確認
    const existing = await prisma.achievement.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: '実績が存在しません' })
    }
 
    await prisma.achievement.delete({ where: { id } })
    res.json({ message: '削除しました' })
  } catch (error) {
    res.status(500).json({ error: '実績の削除に失敗しました' })
  }
})
 
export default router
 