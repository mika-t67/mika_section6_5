import Link from 'next/link'

const cards = [
  { label: 'プロフィール', description: '名前・bio・SNSリンクを編集', href: '/admin/profile' },
  { label: 'スキル', description: 'スキルの追加・編集・削除', href: '/admin/skills' },
  { label: '実績', description: '制作物の追加・編集・削除', href: '/admin/works' },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-light text-zinc-800">ダッシュボード</h1>
        <p className="mt-1 text-sm text-zinc-400">ポートフォリオの内容を管理できます。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="text-base font-medium text-zinc-700">{card.label}</p>
            <p className="mt-1 text-sm text-zinc-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}