import Link from 'next/link'

const navItems = [
  { label: 'HOME', href: '/#top' },
  { label: 'ABOUT', href: '/#about' },
  { label: 'PROJECT', href: '/#projects' },
  { label: 'CONTACT', href: '/#contact' },
]

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] bg-cream">
      <nav
        aria-label="メインナビゲーション"
        className="mx-auto flex h-full max-w-6xl items-center justify-end px-5 md:px-10"
      >
        <ul className="flex gap-5 md:gap-10">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-sm font-nav text-sm font-bold tracking-wide text-navy transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:text-base"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}