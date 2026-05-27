import { Router } from 'express'
import prisma from '../lib/prisma'
 
const router = Router()
 
// GET /skills
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { createdAt: 'asc' } })
    res.json(skills)
  } catch (error) {
    res.status(500).json({ error: 'スキルの取得に失敗しました' })
  }
})
 
// POST /skills
router.post('/', async (req, res) => {
  try {
    const { name, category, level } = req.body
    const skill = await prisma.skill.create({
      data: { name, category, level: parseInt(level) },
    })
    res.status(201).json(skill)
  } catch (error) {
    res.status(500).json({ error: 'スキルの作成に失敗しました' })
  }
})
 
// PUT /skills/:id
router.put('/:id', async (req, res) => {
  try {
    // ID validation
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }
 
    // 存在確認
    const existing = await prisma.skill.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'スキルが存在しません' })
    }
 
    const { name, category, level } = req.body
    const skill = await prisma.skill.update({
      where: { id },
      data: { name, category, level: parseInt(level) },
    })
    res.json(skill)
  } catch (error) {
    res.status(500).json({ error: 'スキルの更新に失敗しました' })
  }
})
 
// DELETE /skills/:id
router.delete('/:id', async (req, res) => {
  try {
    // ID validation
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }
 
    // 存在確認
    const existing = await prisma.skill.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: 'スキルが存在しません' })
    }
 
    await prisma.skill.delete({ where: { id } })
    res.json({ message: '削除しました' })
  } catch (error) {
    res.status(500).json({ error: 'スキルの削除に失敗しました' })
  }
})
 
export default router
 