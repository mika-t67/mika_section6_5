'use client'


import { useState } from 'react'
import { mockProfile } from '@/lib/mockData'

export default function AdminProfilePage() {
  const [form, setForm] = useState(mockProfile)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API繋ぎ込み時に実装
    console.log('保存データ:', form)
    setSaved(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-zinc-800">プロフィール編集</h1>
        <p className="mt-1 text-sm text-zinc-400">トップページのプロフィールを編集できます。</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        {[
          { label: '名前', name: 'name', type: 'text' },
          { label: '名前（英語）', name: 'nameEn', type: 'text' },
          { label: '役職・肩書き', name: 'role', type: 'text' },
          { label: 'メールアドレス', name: 'email', type: 'email' },
          { label: 'GitHub URL', name: 'githubUrl', type: 'url' },
          { label: 'Twitter URL', name: 'twitterUrl', type: 'url' },
        ].map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-xs tracking-widest text-zinc-400 uppercase">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={(form as any)[field.name] ?? ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-zinc-400"
            />
          </div>
        ))}

        <div className="space-y-1">
          <label className="text-xs tracking-widest text-zinc-400 uppercase">自己紹介</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-zinc-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-lg bg-zinc-800 px-6 py-2 text-sm text-white transition hover:bg-zinc-700"
          >
            保存する
          </button>
          {saved && <p className="text-xs text-green-500">保存しました ✓</p>}
        </div>
      </form>
    </div>
  )
}
