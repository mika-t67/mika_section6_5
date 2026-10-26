import { Router } from 'express'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import upload from '../middleware/upload'
import redis from '../lib/redis'
import { verifyToken } from '../middleware/auth'

const router = Router()
const CACHE_KEY = 'achievements'
const CACHE_TTL = 60 * 60 // 1時間
const DEVICES = ['pc', 'mobile'] as const

type Device = (typeof DEVICES)[number]

// ===== 共通の処理 =====

// 1件分のキャッシュキー（例：achievements:3）
const detailCacheKey = (id: number) => `${CACHE_KEY}:${id}`

// 一覧と、指定した作品のキャッシュをまとめて削除する
const clearCache = async (id?: number) => {
  try {
    const keys = id === undefined ? [CACHE_KEY] : [CACHE_KEY, detailCacheKey(id)]
    await redis.del(...keys)
  } catch (redisError) {
    console.error('Redisキャッシュ削除失敗:', redisError)
  }
}

// 画像をCloudinaryにアップロードしてURLを返す
const uploadImage = (buffer: Buffer) =>
  new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'portfolio/achievements' }, (error, result) => {
        if (error || !result) reject(error)
        else resolve(result.secure_url)
      })
      .end(buffer)
  })

// 空欄は null にする（管理画面から内容を消せるように）。送られてこなかった項目は undefined のまま（更新しない）
const toNullableText = (value: unknown): string | null | undefined => {
  if (typeof value !== 'string') return undefined
  return value.trim() === '' ? null : value
}

type DetailFields = {
  device?: Device
  sortOrder?: number
  devType?: string | null
  period?: string | null
  role?: string | null
  techReason?: string | null
  challenge?: string | null
  githubUrl?: string | null
}

type ParseResult = { ok: true; data: DetailFields } | { ok: false; error: string }

// 新しく追加した項目を、フォームの値から保存用の形に変換する
const parseDetailFields = (body: Record<string, unknown>): ParseResult => {
  const { device, sortOrder } = body

  if (device !== undefined && !DEVICES.includes(device as Device)) {
    return { ok: false, error: 'deviceはpcまたはmobileを指定してください' }
  }

  let parsedSortOrder: number | undefined
  if (sortOrder !== undefined && sortOrder !== '') {
    parsedSortOrder = Number(sortOrder)
    if (!Number.isInteger(parsedSortOrder)) {
      return { ok: false, error: '並び順は整数で指定してください' }
    }
  }

  return {
    ok: true,
    data: {
      device: device as Device | undefined,
      sortOrder: parsedSortOrder,
      devType: toNullableText(body.devType),
      period: toNullableText(body.period),
      role: toNullableText(body.role),
      techReason: toNullableText(body.techReason),
      challenge: toNullableText(body.challenge),
      githubUrl: toNullableText(body.githubUrl),
    },
  }
}

// ===== ルート =====

// GET /achievements（公開）
router.get('/', async (req, res) => {
  try {
    // キャッシュ確認
    try {
      const cached = await redis.get(CACHE_KEY)
      if (cached) {
        try {
          return res.json(JSON.parse(cached))
        } catch (parseError) {
          console.error('Redisキャッシュのパース失敗、DBにフォールバック:', parseError)
        }
      }
    } catch (redisError) {
      console.error('Redisキャッシュ取得失敗、DBにフォールバック:', redisError)
    }

    // 並び順の小さい順。同じ並び順なら新しい順
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    // キャッシュに保存
    try {
      await redis.set(CACHE_KEY, JSON.stringify(achievements), 'EX', CACHE_TTL)
    } catch (redisError) {
      console.error('Redisキャッシュ保存失敗:', redisError)
    }

    res.json(achievements)
  } catch (error) {
    res.status(500).json({ error: '実績の取得に失敗しました' })
  }
})

// GET /achievements/:id（公開）
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }

    // キャッシュ確認
    try {
      const cached = await redis.get(detailCacheKey(id))
      if (cached) {
        try {
          return res.json(JSON.parse(cached))
        } catch (parseError) {
          console.error('Redisキャッシュのパース失敗、DBにフォールバック:', parseError)
        }
      }
    } catch (redisError) {
      console.error('Redisキャッシュ取得失敗、DBにフォールバック:', redisError)
    }

    const achievement = await prisma.achievement.findUnique({ where: { id } })
    if (!achievement) {
      return res.status(404).json({ error: '実績が存在しません' })
    }

    // キャッシュに保存
    try {
      await redis.set(detailCacheKey(id), JSON.stringify(achievement), 'EX', CACHE_TTL)
    } catch (redisError) {
      console.error('Redisキャッシュ保存失敗:', redisError)
    }

    res.json(achievement)
  } catch (error) {
    res.status(500).json({ error: '実績の取得に失敗しました' })
  }
})

// POST /achievements（要認証）
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const parsed = parseDetailFields(req.body)
    if (!parsed.ok) {
      return res.status(400).json({ error: parsed.error })
    }

    const { title, description, tags, url, imageAlt } = req.body
    const imageUrl = req.file ? await uploadImage(req.file.buffer) : undefined

    const achievement = await prisma.achievement.create({
      data: { title, description, tags, url, imageUrl, imageAlt, ...parsed.data },
    })

    await clearCache()

    res.status(201).json(achievement)
  } catch (error) {
    res.status(500).json({ error: '実績の作成に失敗しました' })
  }
})

// PUT /achievements/:id（要認証）
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }

    const existing = await prisma.achievement.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: '実績が存在しません' })
    }

    const parsed = parseDetailFields(req.body)
    if (!parsed.ok) {
      return res.status(400).json({ error: parsed.error })
    }

    const { title, description, tags, url, imageAlt } = req.body
    const imageUrl = req.file ? await uploadImage(req.file.buffer) : undefined

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        title,
        description,
        tags,
        url,
        imageAlt,
        ...(imageUrl && { imageUrl }),
        ...parsed.data,
      },
    })

    await clearCache(id)

    res.json(achievement)
  } catch (error) {
    res.status(500).json({ error: '実績の更新に失敗しました' })
  }
})

// DELETE /achievements/:id（要認証）
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      return res.status(400).json({ error: '無効なIDです' })
    }

    const existing = await prisma.achievement.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: '実績が存在しません' })
    }

    await prisma.achievement.delete({ where: { id } })

    await clearCache(id)

    res.json({ message: '削除しました' })
  } catch (error) {
    res.status(500).json({ error: '実績の削除に失敗しました' })
  }
})

export default router