'use client'

// src/app/(admin)/admin/login/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/admin')
    } catch (err) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-sm space-y-10">
        {/* タイトル */}
        <div className="space-y-2">
          <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">Admin</p>
          <h1 className="text-2xl font-light text-zinc-800">ログイン</h1>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs tracking-widest text-zinc-400 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest text-zinc-400 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              required
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-zinc-400"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-800 py-2 text-sm text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </main>
  )
}
