import { Request, Response, NextFunction } from 'express'
import { adminAuth } from '../lib/firebaseAdmin'

// req.user を使えるように型を拡張
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string
        email?: string
      }
    }
  }
}

/**
 * Authorization: Bearer <idToken> を検証するミドルウェア
 * 検証に失敗した場合はハンドラに進ませない
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '認証情報がありません' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  if (!idToken) {
    return res.status(401).json({ error: '認証情報がありません' })
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken)
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    }
    next()
  } catch (error) {
    console.error('IDトークンの検証に失敗:', error)
    return res.status(401).json({ error: '認証に失敗しました' })
  }
}