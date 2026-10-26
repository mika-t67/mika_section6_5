'use client'

import { useEffect, useState } from 'react'
import { getContacts } from '@/lib/api'
import type { Contact } from '@/types'

// 受信日時を日本時間で表示する（例：2026/10/26 14:30）
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data: Contact[] = await getContacts()
        setContacts(data)
      } catch (err) {
        console.error('お問い合わせ取得失敗:', err)
        setError('お問い合わせの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-zinc-800">お問い合わせ</h1>
        <p className="mt-1 text-sm text-zinc-400">
          サイトのフォームから届いたお問い合わせを確認できます。
          {!loading && !error && `（${contacts.length}件）`}
        </p>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-sm text-zinc-400">
          読み込み中...
        </p>
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : contacts.length === 0 ? (
        <p className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-sm text-zinc-400">
          お問い合わせはまだありません
        </p>
      ) : (
        <ul className="space-y-4">
          {contacts.map((contact) => (
            <li key={contact.id} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-medium text-zinc-800">{contact.name}</p>
                  <p className="mt-1 break-all text-sm text-zinc-500">{contact.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <time dateTime={contact.createdAt} className="text-xs text-zinc-400">
                    {formatDate(contact.createdAt)}
                  </time>
                  <a
                    href={`mailto:${contact.email}`}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-50"
                  >
                    返信する
                  </a>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words border-t border-zinc-100 pt-4 text-sm leading-relaxed text-zinc-700">
                {contact.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}