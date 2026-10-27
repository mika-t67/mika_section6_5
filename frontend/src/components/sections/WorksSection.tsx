import Link from 'next/link'
import type { Achievement } from '@/types'
import FadeIn from '@/components/ui/FadeIn'
import DeviceFrame from '@/components/ui/DeviceFrame'

type Props = {
  achievements: Achievement[]
}

// PROJECTSの上下を区切る波。下側は同じ形を上下反転して使う
function Wave({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={`block h-16 w-full text-blush md:h-32 ${flip ? '-mt-px -scale-y-100' : '-mb-px'}`}
    >
      <path
        d="M0,96 C240,16 480,16 720,80 C960,144 1200,152 1440,40 L1440,160 L0,160 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function WorksSection({ achievements }: Props) {
  // 並び順の小さい順（同じ値なら元の順番のまま）
  const works = [...achievements].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section id="projects">
      <Wave />

      <div className="bg-blush px-5 pb-20 pt-10 md:px-16 md:pb-48 md:pt-14">
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
      </div>

      <Wave flip />
    </section>
  )
}