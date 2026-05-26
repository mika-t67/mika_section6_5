'use client'

// src/app/(admin)/admin/skills/page.tsx

import { useState } from 'react'
import { mockSkills } from '@/lib/mockData'
import { Skill } from '@/types'

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(mockSkills)
  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend' as Skill['category'], level: 3 as Skill['level'] })

  const handleAdd = () => {
    if (!newSkill.name.trim()) return
    const id = Math.max(...skills.map((s) => s.id)) + 1
    setSkills((prev) => [...prev, { ...newSkill, id }])
    setNewSkill({ name: '', category: 'frontend', level: 3 })
  }

  const handleDelete = (id: number) => {
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-zinc-800">スキル管理</h1>
        <p className="mt-1 text-sm text-zinc-400">スキルの追加・削除ができます。</p>
      </div>

      {/* 追加フォーム */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="space-y-1">
          <label className="text-xs tracking-widest text-zinc-400 uppercase">スキル名</label>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
            placeholder="例: Vue.js"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs tracking-widest text-zinc-400 uppercase">カテゴリ</label>
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value as Skill['category'] }))}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-400"
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-zinc-800 px-5 py-2 text-sm text-white transition hover:bg-zinc-700"
        >
          追加
        </button>
      </div>

      {/* スキル一覧 */}
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs tracking-widest text-zinc-400 uppercase">
              <th className="px-6 py-4">スキル名</th>
              <th className="px-6 py-4">カテゴリ</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-b border-zinc-50 last:border-0">
                <td className="px-6 py-4 text-zinc-700">{skill.name}</td>
                <td className="px-6 py-4 text-zinc-400">{skill.category}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
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

