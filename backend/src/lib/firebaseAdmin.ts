import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

/**
 * .env からコピーする際に混入しやすいゴミを除去する
 * - 前後の空白
 * - 末尾のカンマ（JSONから行ごとコピーした場合に残る）
 * - 前後のクォート
 */
const sanitize = (raw: string | undefined): string | undefined =>
  raw?.trim().replace(/,$/, '').replace(/^["']|["']$/g, '')

const projectId = sanitize(process.env.FIREBASE_PROJECT_ID)
const clientEmail = sanitize(process.env.FIREBASE_CLIENT_EMAIL)

/**
 * 環境変数から読んだ秘密鍵をPEM形式に整える
 * - 前後に残ったクォートを除去
 * - 文字列 "\n"（2文字）を実際の改行に変換
 * - Windows由来の CR を除去（PEMのデコードに失敗する原因になる）
 */
const normalizePrivateKey = (raw: string): string =>
  raw
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '')

const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY
const privateKey = rawPrivateKey ? normalizePrivateKey(rawPrivateKey) : undefined

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    'Firebase Admin SDK の環境変数が設定されていません（FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY）'
  )
}

if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
  throw new Error(
    'FIREBASE_PRIVATE_KEY が PEM 形式になっていません。.env の値がクォートで囲まれているか、改行が正しいか確認してください'
  )
}

// ホットリロードなどで多重初期化されるのを防ぐ
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

export const adminAuth = getAuth()