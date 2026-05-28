// src/components/sections/ContactSection.tsx

import Link from 'next/link'

export default function ContactSection() {
  return (
    <section className="relative bg-[#f4f3f0] px-6 py-24 md:px-16">
      {/* 背景の有機的な装飾（CONTACTのみ） */}
      <div
        className="pointer-events-none absolute bottom-[-40px] left-[-60px] h-[320px] w-[320px] bg-stone-400/20"
        style={{ borderRadius: '40% 60% 60% 40% / 40% 60% 40% 60%' }}
      />

      <div className="relative z-10 mx-auto max-w-xl space-y-10">
        <div className="space-y-3">
          <p className="text-sm tracking-[0.3em] text-stone-400 uppercase">Contact</p>
          <h2 className="text-3xl font-light text-stone-800">お問い合わせ</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            お仕事のご依頼・ご相談はお気軽にどうぞ。
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-block rounded-full border border-stone-300 px-10 py-3 text-sm tracking-widest text-stone-600 transition hover:bg-stone-800 hover:text-white"
        >
          お問い合わせはこちら →
        </Link>
      </div>
    </section>
  )
}
