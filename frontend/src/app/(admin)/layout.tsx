'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthChange, signOut } from '@/lib/auth'

const navItems = [
  { label: 'ダッシュボード', href: '/admin' },
  { label: 'プロフィール', href: '/admin/profile' },
  { label: 'スキル', href: '/admin/skills' },
  { label: '実績', href: '/admin/works' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }

    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        router.replace('/admin/login')
      } else {
        setChecking(false)
      }
    })

    return unsubscribe
  }, [isLoginPage, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  // ログイン画面はサイドバーなしで表示
  if (isLoginPage) {
    return <>{children}</>
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-400">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-800">
      {/* サイドバー */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-8">
        <p className="mb-8 px-2 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
          Admin
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-16">
          <Link
            href="/"
            className="block px-3 py-2 text-xs text-zinc-400 transition hover:text-zinc-600"
          >
            ← サイトを見る
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="block w-full rounded-lg px-3 py-2 text-left text-xs text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 px-8 py-10">{children}</main>
    </div>
  )
}