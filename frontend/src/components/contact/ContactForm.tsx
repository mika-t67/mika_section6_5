'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { createContact } from '@/lib/api'

type FormState = {
  name: string
  email: string
  message: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY_FORM: FormState = { name: '', email: '', message: '' }

const inputClass =
  'w-full rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition focus:border-brand'
const labelClass = 'text-sm tracking-wide text-navy'

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
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
      setForm(EMPTY_FORM)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      const apiMessage =
        axios.isAxiosError(error) && typeof error.response?.data?.error === 'string'
          ? error.response.data.error
          : null
      setErrorMessage(apiMessage ?? '送信に失敗しました。時間をおいて再度お試しください。')
    }
  }

  // ===== 送信完了 =====
  if (status === 'success') {
    return (
      <div role="status" className="rounded-3xl bg-white px-6 py-14 text-center">
        <p className="text-lg font-bold tracking-wide text-navy md:text-xl">ありがとうございました。</p>
        <p className="mt-4 text-sm leading-loose tracking-wide text-navy">
          内容を確認のうえ、ご連絡いたします。
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-navy px-8 py-2.5 text-sm tracking-wide text-navy transition hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          トップへ戻る
        </Link>
      </div>
    )
  }

  // ===== 入力フォーム =====
  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate={false}>
      <div className="space-y-2">
        <label htmlFor="name" className={labelClass}>
          お名前<span className="ml-1 text-brand">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="山田 花子"
          autoComplete="name"
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className={labelClass}>
          メールアドレス<span className="ml-1 text-brand">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@example.com"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={labelClass}>
          メッセージ<span className="ml-1 text-brand">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={6}
          placeholder="ご用件をご記入ください"
          required
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-brand">
          {errorMessage}
        </p>
      )}

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-brand px-12 py-3 text-sm font-bold tracking-wide text-white transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:opacity-50"
        >
          {status === 'sending' ? '送信中...' : '送信する'}
        </button>
      </div>
    </form>
  )
}