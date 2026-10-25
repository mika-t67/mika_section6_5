import { DM_Sans, Montserrat, Zen_Kaku_Gothic_New } from 'next/font/google'

// ナビ用
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// 見出し・portfolio・Web Engineer用
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

// 日本語本文用（日本語フォントは容量が大きいので事前読み込みしない）
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  variable: '--font-zen-kaku',
  display: 'swap',
  preload: false,
})

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className={`public-site flex-1 ${dmSans.variable} ${montserrat.variable} ${zenKaku.variable}`}
    >
      {children}
    </div>
  )
}