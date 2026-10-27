import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-navy/15 px-5 py-8 md:px-16">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <p className="font-nav text-xs tracking-wide text-navy/70">© {year} Mika Takahashi</p>
        <Link
          href="/admin/login"
          className="rounded-sm text-xs text-ink/40 underline-offset-4 transition hover:text-ink/70 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          管理者ログイン
        </Link>
      </div>
    </footer>
  )
}