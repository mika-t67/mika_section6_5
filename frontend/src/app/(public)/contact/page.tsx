import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '高橋美香へのお問い合わせフォームです。',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <section className="px-5 pb-20 pt-8 md:px-16 md:pb-28 md:pt-10">
        <div className="mx-auto max-w-4xl">
          {/* ===== 見出し ===== */}
          <header>
            <p className="font-heading text-2xl font-bold tracking-tight text-brand md:text-3xl">
              CONTACT .
            </p>
            <h1 className="mt-3 pl-6 text-base tracking-wide text-navy md:pl-10 md:text-lg">お問い合わせ</h1>
            <p className="mt-6 pl-6 text-sm leading-loose tracking-wide text-navy md:pl-10">
              ご質問やご連絡は、こちらのフォームからお気軽にどうぞ。
              <br />
              <span className="text-brand">*</span> は入力必須の項目です。
            </p>
          </header>

          {/* ===== フォーム ===== */}
          <div className="mx-auto mt-10 max-w-xl md:mt-12">
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}