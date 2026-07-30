import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  onIdTokenChanged,
  User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const setAuthCookie = (token: string) => {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict${secure}`
}

const clearAuthCookie = () => {
  document.cookie = 'auth-token=; path=/; max-age=0'
}

// トークンが自動更新されるたびにクッキーも同期する
// （これがないと1時間後にクッキーだけ切れて管理画面が見られなくなる）
if (typeof window !== 'undefined') {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      setAuthCookie(await user.getIdToken())
    } else {
      clearAuthCookie()
    }
  })
}

// 認証状態の初期化が終わるまで待つためのPromise
// リロード直後は currentUser が一瞬 null になるため
export const authReady = new Promise<User | null>((resolve) => {
  if (typeof window === 'undefined') {
    resolve(null)
    return
  }
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe()
    resolve(user)
  })
})

// ログイン
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  setAuthCookie(await userCredential.user.getIdToken())
  return userCredential.user
}

// ログアウト
export const signOut = async () => {
  await firebaseSignOut(auth)
  clearAuthCookie()
}

// APIリクエスト用のIDトークンを取得（期限切れなら自動で更新される）
export const getIdToken = async (): Promise<string | null> => {
  await authReady
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}

// 認証状態の監視
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}