import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://mika-section6-5.vercel.app'
const siteTitle = 'Mika Takahashi | Web Engineer Portfolio'
const siteDescription =
  '幼稚園教諭・保育士として7年間勤務した後、Webエンジニアへ。Next.js / React / TypeScript / Express.js を用いたWebアプリケーション開発のポートフォリオです。'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Mika Takahashi',
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    siteName: 'Mika Takahashi Portfolio',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    description: siteDescription,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
