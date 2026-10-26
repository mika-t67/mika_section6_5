import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache, type ReactNode } from 'react'
import axios from 'axios'
import { getAchievement, getAchievements } from '@/lib/api'
import { mockAchievements } from '@/lib/mockData'
import type { Achievement } from '@/types'
import DeviceFrame from '@/components/ui/DeviceFrame'
import FadeIn from '@/components/ui/FadeIn'
import Footer from '@/components/Footer'

type Props = {
  params: Promise<{ id: string }>
}

// 作っておいたページをすぐ返しつつ、60秒たったら裏で最新のデータに作り直す
export const revalidate = 60

// ビルドのときに、今ある作品の詳細ページを先に作っておく
// （あとから追加した作品は、最初にアクセスされたときに作られる）
export async function generateStaticParams() {
  try {
    const works = await getAchievements()
    return works.map((work) => ({ id: String(work.id) }))
  } catch {
    return mockAchievements.map((work) => ({ id: String(work.id) }))
  }
}

// URLのIDを数値にする（正の整数以外は無効）
const parseId = (value: string): number | null => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

// タイトル設定とページ表示で同じデータを使うので、cacheでAPIへのリクエストを1回にまとめる
const fetchWork = cache(async (id: number): Promise<Achievement | null> => {
  try {
    return await getAchievement(id)
  } catch (error) {
    // 存在しない作品
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    // APIにつながらないときは予備データから探す
    return mockAchievements.find((work) => work.id === id) ?? null
  }
})

const hasText = (value?: string | null): value is string => Boolean(value?.trim())

const linkClass =
  'break-all text-navy underline underline-offset-4 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const workId = parseId(id)
  const work = workId ? await fetchWork(workId) : null

  if (!work) {
    return { title: 'ページが見つかりません' }
  }

  return {
    title: work.title,
    description: work.description,
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: `/works/${work.id}`,
      siteName: 'Mika Takahashi Portfolio',
      title: `${work.title} | Mika Takahashi`,
      description: work.description,
    },
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params
  const workId = parseId(id)
  if (!workId) notFound()

  const work = await fetchWork(workId)
  if (!work) notFound()

  const isMobile = work.device === 'mobile'

  // 項目名と内容の2列で並べる情報（中身があるものだけ表示）
  const rows: { label: string; content: ReactNode }[] = []

  if (hasText(work.devType) || hasText(work.period)) {
    rows.push({
      label: '期間',
      content: (
        <>
          {hasText(work.devType) && <span className="block">{work.devType}</span>}
          {hasText(work.period) && <span className="block">期間：{work.period}</span>}
        </>
      ),
    })
  }
  if (hasText(work.description)) {
    rows.push({ label: '概要', content: work.description })
  }
  if (work.tags.length > 0) {
    rows.push({ label: '使用技術', content: work.tags.join(' / ') })
  }
  if (hasText(work.role)) {
    rows.push({ label: '担当範囲', content: work.role })
  }
  if (hasText(work.techReason)) {
    rows.push({ label: '技術選定の理由', content: work.techReason })
  }
  if (hasText(work.challenge)) {
    rows.push({ label: '苦労したことと解決策', content: work.challenge })
  }
  if (hasText(work.url)) {
    rows.push({
      label: 'URL',
      content: (
        <a href={work.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {work.url}
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
      ),
    })
  }
  if (hasText(work.githubUrl)) {
    rows.push({
      label: 'GitHub',
      content: (
        <a href={work.githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {work.githubUrl}
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
      ),
    })
  }

  // ===== 作品の画像（カードの大きさは枠に合わせる） =====
  const imageCard = (
    <div
      className={`group mx-auto flex justify-center rounded-3xl bg-white ${
        isMobile ? 'w-fit px-10 py-8 md:mx-0 md:px-14 md:py-10' : 'w-full max-w-3xl px-[8%] py-[7%]'
      }`}
    >
      <DeviceFrame
        device={work.device}
        src={work.imageUrl}
        alt={work.imageAlt || `${work.title}の画面`}
        sizes={isMobile ? '(min-width: 768px) 208px, 160px' : '(min-width: 768px) 640px, 80vw'}
        className={isMobile ? 'w-40 md:w-52' : 'w-full'}
        priority
      />
    </div>
  )

  // ===== 作品の情報（左のネイビーの細い縦線つき） =====
  const infoList =
    rows.length > 0 ? (
      <dl
        className={`space-y-8 border-l border-navy py-2 pl-3 md:space-y-10 md:pl-4 ${
          isMobile ? 'mt-14 md:mt-0' : 'mx-auto mt-14 max-w-2xl md:mt-16'
        }`}
      >
        {rows.map((row) => (
          <FadeIn
            key={row.label}
            className={`grid gap-2 sm:gap-6 ${isMobile ? 'sm:grid-cols-[8rem_1fr]' : 'sm:grid-cols-[10rem_1fr]'}`}
          >
            {/* 項目名と説明の行の高さをそろえて、1行目の位置を合わせる */}
            <dt className="flex gap-2 text-sm leading-loose tracking-wide text-navy">
              <span aria-hidden="true" className="text-brand">
                ・
              </span>
              {row.label}
            </dt>
            <dd className="whitespace-pre-line pl-6 text-sm leading-loose tracking-wide text-navy sm:pl-0">
              {row.content}
            </dd>
          </FadeIn>
        ))}
      </dl>
    ) : null

  return (
    <main className="min-h-screen">
      <article className="px-5 pb-20 pt-8 md:px-16 md:pb-28 md:pt-10">
        <div className="mx-auto max-w-4xl">
          {/* ===== 見出しと作品名 ===== */}
          <header>
            <p className="font-heading text-2xl font-bold tracking-tight text-brand md:text-3xl">
              PROJECTS .
            </p>
            <h1 className="mt-3 pl-6 text-base tracking-wide text-navy md:pl-10 md:text-lg">{work.title}</h1>
          </header>

          {isMobile ? (
            // スマホ枠の作品：広い画面では「左にスマホ、右に情報」の横並び
            <div className="mt-8 md:mt-10 md:grid md:grid-cols-[auto_1fr] md:items-start md:gap-12">
              {/* 右の文章を読んでいる間も、スマホの画面がヘッダーの下に残り続ける */}
              <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">{imageCard}</div>
              {infoList}
            </div>
          ) : (
            // PC枠の作品：上に画像、下に情報
            <>
              <div className="mt-8 md:mt-10">{imageCard}</div>
              {infoList}
            </>
          )}

          {/* ===== 一覧へ戻る ===== */}
          <div className="mt-16 text-center md:mt-20">
            <Link
              href="/#projects"
              className="inline-block rounded-full border border-navy px-6 py-2 text-sm tracking-wide text-navy transition hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              PROJECTS一覧へ戻る
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}