import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
 
// ログイン
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const token = await userCredential.user.getIdToken()
 
  // クッキーにトークンをセット
  document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`
 
  return userCredential.user
}
 
// ログアウト
export const signOut = async () => {
  await firebaseSignOut(auth)
 
  // クッキーを削除
  document.cookie = 'auth-token=; path=/; max-age=0'
}
 
// 認証状態の監視
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
 