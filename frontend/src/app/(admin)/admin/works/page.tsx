'use client'

// src/app/(admin)/admin/works/page.tsx

import { useState } from 'react'
import { mockAchievements } from '@/lib/mockData'
import { Achievement } from '@/types'

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Achievement[]>(mockAchievements)
  const [newWork, setNewWork] = useState({ title: '', description: '', tags: '', url: '' })

  const handleAdd = () => {
    if (!newWork.title.trim()) return
    const id = Math.max(...works.map((w) => w.id)) + 1
    setWorks((prev) => [
      ...prev,
      {
        id,
        title: newWork.title,
        description: newWork.description,
        imageUrl: '/images/works/work1.svg',
        tags: newWork.tags.split(',').map((t) => t.trim()).filter(Boolean),
        url: newWork.url || undefined,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ])
    setNewWork({ title: '', description: '', tags: '', url: '' })
  }

  const handleDelete = (id: number) => {
    setWorks((prev) => prev.filter((w) => w.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-zinc-800">実績管理</h1>
        <p className="mt-1 text-sm text-zinc-400">制作物の追加・削除ができます。</p>
      </div>

      {/* 追加フォーム */}
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="text-sm font-medium text-zinc-600">新しい実績を追加</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'タイトル', key: 'title', placeholder: 'ポートフォリオサイト' },
            { label: 'URL（任意）', key: 'url', placeholder: 'https://example.com' },
            { label: 'タグ（カンマ区切り）', key: 'tags', placeholder: 'React, TypeScript' },
          ].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs tracking-widest text-zinc-400 uppercase">{f.label}</label>
              <input
                type="text"
                value={(newWork as any)[f.key]}
                onChange={(e) => setNewWork((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-400"
              />
            </div>
          ))}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs tracking-widest text-zinc-400 uppercase">説明</label>
            <textarea
              value={newWork.description}
              onChange={(e) => setNewWork((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              placeholder="制作物の説明"
              className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-400"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-zinc-800 px-5 py-2 text-sm text-white transition hover:bg-zinc-700"
        >
          追加
        </button>
      </div>

      {/* 実績一覧 */}
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs tracking-widest text-zinc-400 uppercase">
              <th className="px-6 py-4">タイトル</th>
              <th className="px-6 py-4">タグ</th>
              <th className="px-6 py-4">日付</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id} className="border-b border-zinc-50 last:border-0">
                <td className="px-6 py-4 text-zinc-700">{work.title}</td>
                <td className="px-6 py-4 text-zinc-400">{work.tags.join(', ')}</td>
                <td className="px-6 py-4 text-zinc-400">{work.createdAt}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(work.id)}
                    className="text-xs text-red-400 transition hover:text-red-600"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
