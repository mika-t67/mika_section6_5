import { Router } from 'express'
import prisma from '../lib/prisma'
 
const router = Router()
 
// POST /contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body
 
    if (!name || !email || !message) {
        return res.status(400).json({ error: '名前・メールアドレス・メッセージは必須です' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: '有効なメールアドレスを入力してください' })
    }
 
    const contact = await prisma.contact.create({
      data: { name, email, message },
    })
 
    res.status(201).json({ message: 'お問い合わせを受け付けました', contact })
    } catch (error) {
      console.error('お問い合わせ保存エラー:', error)
      res.status(500).json({ error: 'お問い合わせの送信に失敗しました' })
    }
})
 
 
export default router
 