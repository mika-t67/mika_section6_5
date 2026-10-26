import Link from 'next/link'
import type { Achievement } from '@/types'
import FadeIn from '@/components/ui/FadeIn'
import DeviceFrame from '@/components/ui/DeviceFrame'

type Props = {
  achievements: Achievement[]
}

export default function WorksSection({ achievements }: Props) {
  // 並び順の小さい順（同じ値なら元の順番のまま）
  const works = [...achievements].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section id="projects" className="px-5 py-24 md:px-16 md:pb-52 md:pt-32">
      <div className="mx-auto max-w-4xl">
        {/* ===== 見出し ===== */}
        <FadeIn>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-brand md:text-3xl">
            PROJECTS .
          </h2>
        </FadeIn>

        {/* ===== 作品一覧（PCでは右の列を下にずらして互い違いに） ===== */}
        <ul className="mt-10 grid gap-14 md:mt-14 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
          {works.map((work, index) => (
            <li key={work.id} className={index % 2 === 1 ? 'md:translate-y-24' : ''}>
              <FadeIn delay={(index % 2) * 150}>
                <Link
                  href={`/works/${work.id}`}
                  className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {/* カード */}
                  <div className="flex aspect-[5/4] items-center justify-center rounded-3xl bg-white transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none">
                    <DeviceFrame
                      device={work.device}
                      src={work.imageUrl}
                      alt={work.imageAlt || `${work.title}の画面`}
                      sizes={work.device === 'mobile' ? '(min-width: 768px) 130px, 30vw' : '(min-width: 768px) 300px, 70vw'}
                    />
                  </div>

                  {/* 作品名と使用技術 */}
                  <h3 className="mt-5 text-base font-bold tracking-wide transition-colors group-hover:text-brand md:text-lg">
                    {work.title}
                  </h3>
                  {work.tags.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-nav text-xs text-ink/70 md:text-sm">
                      {work.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}