'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createContact } from '@/lib/api'

type FormState = {
  name: string
  email: string
  message: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setStatus('idle')
    setErrorMessage('') 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      await createContact(form)
      setForm({ name: '', email: '', message: '' })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      const axiosError = err as any
      setErrorMessage(
       axiosError?.response?.data?.error || '送信に失敗しました。時間をおいて再度お試しください。'
      )
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f8f6] px-6 py-24 text-stone-800 md:px-16">
      <div className="relative mx-auto max-w-xl">
        {/* 背景の有機的な装飾 */}
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 bg-stone-100"
          style={{ borderRadius: '60% 40% 40% 60% / 60% 40% 60% 40%' }}
        />

        <div className="relative z-10 space-y-12">
          {/* 戻るリンク */}
          <Link
            href="/"
            className="inline-block text-xs tracking-widest text-stone-400 underline-offset-4 transition hover:text-stone-700 hover:underline"
          >
            ← Back
          </Link>

          {/* タイトル */}
          <div className="space-y-3">
            <p className="text-sm tracking-[0.3em] text-stone-400 uppercase">Contact</p>
            <h1 className="text-3xl font-light text-stone-800">お問い合わせ</h1>
            <p className="text-sm leading-relaxed text-stone-400">
              お仕事のご依頼・ご相談はお気軽にどうぞ。
            </p>
          </div>

          {/* 送信完了 */}
          {status === 'success' ? (
            <div className="space-y-6 py-12 text-center">
              <p className="text-2xl font-light text-stone-700">ありがとうございました。</p>
              <p className="text-sm text-stone-400">内容を確認次第、ご連絡いたします。</p>
              <Link
                href="/"
                className="inline-block rounded-full border border-stone-300 px-10 py-3 text-sm tracking-widest text-stone-600 transition hover:bg-stone-800 hover:text-white"
              >
                トップへ戻る
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-stone-400 uppercase">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="お名前"
                  required
                  className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-stone-700 placeholder-stone-300 outline-none transition focus:border-stone-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs tracking-widest text-stone-400 uppercase">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="メールアドレス"
                  required
                  className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-stone-700 placeholder-stone-300 outline-none transition focus:border-stone-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs tracking-widest text-stone-400 uppercase">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="メッセージ"
                  required
                  className="w-full resize-none border-b border-stone-200 bg-transparent py-3 text-sm text-stone-700 placeholder-stone-300 outline-none transition focus:border-stone-500"
                />
              </div>

                {status === 'error' && (
                  <p className="text-xs text-red-400">{errorMessage}</p>
                )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="rounded-full border border-stone-300 px-10 py-3 text-sm tracking-widest text-stone-600 transition hover:bg-stone-800 hover:text-white disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
