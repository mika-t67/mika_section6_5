import { DM_Sans, Montserrat, Righteous, Zen_Kaku_Gothic_New } from 'next/font/google'
import Header from '@/components/layout/Header'

// 名前用（最初に表示されるので事前読み込みする）
const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
  display: 'swap',
})

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
      id="top"
      className={`public-site flex-1 ${righteous.variable} ${dmSans.variable} ${montserrat.variable} ${zenKaku.variable}`}
    >
      <Header />
      {/* 固定ヘッダーの高さぶん、中身を下にずらす */}
      <div className="pt-[var(--header-h)]">{children}</div>
    </div>
  )
}