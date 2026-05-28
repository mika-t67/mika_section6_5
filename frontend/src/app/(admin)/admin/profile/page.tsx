'use client'

import { useState, useEffect } from 'react'
import { getProfile, createProfile, updateProfile } from '@/lib/api'

type ProfileForm = {
  name: string
  nameEn: string
  role: string
  bio: string
  email: string
  githubUrl: string
  twitterUrl: string
}

const initialForm: ProfileForm = {
  name: '',
  nameEn: '',
  role: '',
  bio: '',
  email: '',
  githubUrl: '',
  twitterUrl: '',
}

export default function AdminProfilePage() {
  const [profileId, setProfileId] = useState<number | null>(null)
  const [form, setForm] = useState<ProfileForm>(initialForm)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await getProfile()
      if (data) {
        setProfileId(data.id)
        setForm({
          name: data.name ?? '',
          nameEn: data.nameEn ?? '',
          role: data.role ?? '',
          bio: data.bio ?? '',
          email: data.email ?? '',
          githubUrl: data.githubUrl ?? '',
          twitterUrl: data.twitterUrl ?? '',
        })
      }
    } catch (error) {
      console.error('プロフィール取得失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))
      if (avatarFile) formData.append('avatar', avatarFile)

      if (profileId) {
        await updateProfile(profileId, formData)
      } else {
        await createProfile(formData)
      }
      setSaved(true)
      await fetchProfile()
    } catch (error) {
      console.error('プロフィール保存失敗:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-zinc-400">読み込み中...</p>

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
              value={(form as any)[field.name]}
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

        <div className="space-y-1">
          <label className="text-xs tracking-widest text-zinc-400 uppercase">アバター画像</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-zinc-800 px-6 py-2 text-sm text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
          {saved && <p className="text-xs text-green-500">保存しました ✓</p>}
        </div>
      </form>
    </div>
  )
}
