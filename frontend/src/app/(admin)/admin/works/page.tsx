'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '@/lib/api'
import type { Achievement, Device } from '@/types'

type FormState = {
  title: string
  description: string
  tags: string
  url: string
  githubUrl: string
  imageAlt: string
  device: Device
  sortOrder: string
  devType: string
  period: string
  role: string
  techReason: string
  challenge: string
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  tags: '',
  url: '',
  githubUrl: '',
  imageAlt: '',
  device: 'pc',
  sortOrder: '0',
  devType: '',
  period: '',
  role: '',
  techReason: '',
  challenge: '',
}

// 一覧の作品データを、フォームに入れられる形に変換する
const toFormState = (work: Achievement): FormState => ({
  title: work.title,
  description: work.description ?? '',
  tags: work.tags.join(', '),
  url: work.url ?? '',
  githubUrl: work.githubUrl ?? '',
  imageAlt: work.imageAlt ?? '',
  device: work.device ?? 'pc',
  sortOrder: String(work.sortOrder ?? 0),
  devType: work.devType ?? '',
  period: work.period ?? '',
  role: work.role ?? '',
  techReason: work.techReason ?? '',
  challenge: work.challenge ?? '',
})

// 1行で入力する項目
const TEXT_FIELDS: { label: string; key: keyof FormState; placeholder: string }[] = [
  { label: 'タイトル', key: 'title', placeholder: 'ポートフォリオサイト' },
  { label: '公開URL（任意）', key: 'url', placeholder: 'https://example.com' },
  { label: 'GitHubのURL（任意）', key: 'githubUrl', placeholder: 'https://github.com/...' },
  { label: '使用技術（カンマ区切り）', key: 'tags', placeholder: 'React, TypeScript' },
  { label: '開発形態', key: 'devType', placeholder: '個人開発 / チーム開発（4人）' },
  { label: '開発期間', key: 'period', placeholder: '2026年5月〜6月（約1か月）' },
  { label: '画像の説明（alt）', key: 'imageAlt', placeholder: 'ポートフォリオサイトのトップ画面' },
]

// 複数行で入力する項目
const TEXTAREA_FIELDS: { label: string; key: keyof FormState; rows: number; placeholder: string }[] = [
  { label: '概要', key: 'description', rows: 3, placeholder: 'どんなアプリか、誰のための何を解決するものか' },
  { label: '担当範囲', key: 'role', rows: 4, placeholder: 'チーム開発の場合は、自分が担当した画面や機能' },
  { label: '技術選定の理由', key: 'techReason', rows: 4, placeholder: 'その技術を選んだ理由' },
  { label: '課題と解決', key: 'challenge', rows: 6, placeholder: 'ぶつかった課題と、どう解決したか' },
]

const inputClass =
  'w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-400'
const labelClass = 'text-xs tracking-widest text-zinc-400 uppercase'

// APIのエラーメッセージを取り出す
const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.error === 'string') {
    return error.response.data.error
  }
  return fallback
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0) // ファイル選択欄をリセットするため
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const editingWork = works.find((work) => work.id === editingId) ?? null

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const data = await getAchievements()
      setWorks(data)
    } catch (error) {
      console.error('実績取得失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setImageFile(null)
    setFileInputKey((key) => key + 1)
  }

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'タイトルを入力してください' })
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))
      if (imageFile) formData.append('image', imageFile)

      if (editingId === null) {
        await createAchievement(formData)
        setMessage({ type: 'success', text: '追加しました' })
      } else {
        await updateAchievement(editingId, formData)
        setMessage({ type: 'success', text: '更新しました' })
      }

      resetForm()
      await fetchWorks()
    } catch (error) {
      console.error('実績保存失敗:', error)
      setMessage({ type: 'error', text: getErrorMessage(error, '保存に失敗しました') })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (work: Achievement) => {
    setEditingId(work.id)
    setForm(toFormState(work))
    setImageFile(null)
    setFileInputKey((key) => key + 1)
    setMessage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (work: Achievement) => {
    if (!window.confirm(`「${work.title}」を削除しますか？`)) return

    try {
      await deleteAchievement(work.id)
      if (editingId === work.id) resetForm()
      await fetchWorks()
      setMessage({ type: 'success', text: '削除しました' })
    } catch (error) {
      console.error('実績削除失敗:', error)
      setMessage({ type: 'error', text: getErrorMessage(error, '削除に失敗しました') })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-zinc-800">実績管理</h1>
        <p className="mt-1 text-sm text-zinc-400">制作物の追加・編集・削除ができます。</p>
      </div>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}

      {/* 追加・編集フォーム */}
      <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="text-sm font-medium text-zinc-600">
          {editingId === null ? '新しい実績を追加' : `「${editingWork?.title ?? ''}」を編集中`}
        </p>

        {/* 一覧の表示設定 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="device" className={labelClass}>一覧で表示する枠</label>
            <select
              id="device"
              value={form.device}
              onChange={(e) => updateField('device', e.target.value)}
              className={inputClass}
            >
              <option value="pc">PC</option>
              <option value="mobile">スマホ</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="sortOrder" className={labelClass}>並び順（小さいほど前）</label>
            <input
              id="sortOrder"
              type="number"
              step={1}
              value={form.sortOrder}
              onChange={(e) => updateField('sortOrder', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* 1行の項目 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <label htmlFor={field.key} className={labelClass}>{field.label}</label>
              <input
                id={field.key}
                type="text"
                value={form[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {/* 複数行の項目 */}
        <div className="space-y-4">
          {TEXTAREA_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <label htmlFor={field.key} className={labelClass}>{field.label}</label>
              <textarea
                id={field.key}
                value={form[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                rows={field.rows}
                placeholder={field.placeholder}
                className={`${inputClass} resize-y`}
              />
            </div>
          ))}
        </div>

        {/* 画像 */}
        <div className="space-y-2">
          <label htmlFor="image" className={labelClass}>
            画像{editingId !== null && '（変更する場合のみ選択）'}
          </label>
          {editingWork?.imageUrl && !imageFile && (
            <Image
              src={editingWork.imageUrl}
              alt="現在の画像"
              width={160}
              height={100}
              className="h-auto w-40 rounded border border-zinc-200"
            />
          )}
          <input
            key={fileInputKey}
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-zinc-800 px-5 py-2 text-sm text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : editingId === null ? '追加' : '更新'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="rounded-lg border border-zinc-200 px-5 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>

      {/* 実績一覧 */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-sm text-zinc-400">読み込み中...</p>
        ) : works.length === 0 ? (
          <p className="px-6 py-8 text-sm text-zinc-400">実績がありません</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-xs tracking-widest text-zinc-400 uppercase">
                <th className="px-6 py-4">並び順</th>
                <th className="px-6 py-4">タイトル</th>
                <th className="px-6 py-4">枠</th>
                <th className="px-6 py-4">使用技術</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {works.map((work) => (
                <tr
                  key={work.id}
                  className={`border-b border-zinc-50 last:border-0 ${editingId === work.id ? 'bg-zinc-50' : ''}`}
                >
                  <td className="px-6 py-4 text-zinc-400">{work.sortOrder}</td>
                  <td className="px-6 py-4 text-zinc-700">{work.title}</td>
                  <td className="px-6 py-4 text-zinc-400">{work.device === 'mobile' ? 'スマホ' : 'PC'}</td>
                  <td className="px-6 py-4 text-zinc-400">{work.tags.join(', ')}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleEdit(work)}
                      className="mr-4 text-xs text-zinc-500 transition hover:text-zinc-800"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(work)}
                      className="text-xs text-red-400 transition hover:text-red-600"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}