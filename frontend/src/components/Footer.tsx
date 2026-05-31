// src/components/Footer.tsx

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#f4f3f0] px-6 py-8 md:px-16">
      <div className="mx-auto flex max-w-5xl items-center justify-end">
        <Link
          href="/admin/login"
          className="text-xs text-stone-400 underline-offset-4 transition hover:text-stone-600 hover:underline"
        >
          管理者ログイン
        </Link>
      </div>
    </footer>
  )
}

