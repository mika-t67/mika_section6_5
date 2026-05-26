// src/components/sections/ContactSection.tsx

export default function ContactSection() {
  return (
    <section className="relative px-6 py-24 md:px-16">
      {/* 背景の有機的な装飾 */}
      <div
        className="pointer-events-none absolute bottom-[-40px] left-[-60px] h-[320px] w-[320px] bg-stone-100"
        style={{ borderRadius: '40% 60% 60% 40% / 40% 60% 40% 60%' }}
      />

      <div className="relative z-10 mx-auto max-w-xl space-y-12">
        {/* セクションタイトル */}
        <div className="space-y-3">
          <p className="text-sm tracking-[0.3em] text-stone-400 uppercase">Contact</p>
          <h2 className="text-3xl font-light text-stone-800">お問い合わせ</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            お仕事のご依頼・ご相談はお気軽にどうぞ。
          </p>
        </div>

        {/* フォーム（現時点は見た目のみ） */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs tracking-widest text-stone-400 uppercase">Name</label>
            <input
              type="text"
              placeholder="お名前"
              className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-stone-700 placeholder-stone-300 outline-none transition focus:border-stone-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs tracking-widest text-stone-400 uppercase">Email</label>
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-stone-700 placeholder-stone-300 outline-none transition focus:border-stone-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs tracking-widest text-stone-400 uppercase">Message</label>
            <textarea
              rows={4}
              placeholder="メッセージ"
              className="w-full resize-none border-b border-stone-200 bg-transparent py-3 text-sm text-stone-700 placeholder-stone-300 outline-none transition focus:border-stone-500"
            />
          </div>

          <button
            type="button"
            className="mt-4 rounded-full border border-stone-300 px-10 py-3 text-sm tracking-widest text-stone-600 transition hover:bg-stone-800 hover:text-white"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  )
}
