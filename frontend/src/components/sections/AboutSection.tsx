import Image from 'next/image'
import type { Profile, Skill } from '@/types'
import FadeIn from '@/components/ui/FadeIn'

type Props = {
  profile: Profile
  skills: Skill[]
}

// 経歴（年は載せず、流れだけを見せる）
const CAREER = [
  {
    title: '大学で子どもの発達について学ぶ',
    detail: '人間発達学科　卒業',
  },
  {
    title: '幼稚園教諭・保育士として、計7年勤務',
    detail: '子どもや保護者に寄り添いながら、現場の困りごとを仕組みで解決',
  },
  {
    title: 'Ms.Engineerで、Web開発を学ぶ',
    detail: 'フロントエンドからバックエンドまで、チーム開発も経験',
  },
  {
    title: 'Webエンジニアを目指して、学習を継続中',
    detail: '基本情報技術者試験・SQL・Java',
  },
]

// スキルの表示グループ（designカテゴリはOTHERにまとめる）
const SKILL_GROUPS: { label: string; categories: Skill['category'][] }[] = [
  { label: 'FRONTEND', categories: ['frontend'] },
  { label: 'BACKEND', categories: ['backend'] },
  { label: 'OTHER', categories: ['design', 'other'] },
]

export default function AboutSection({ profile, skills }: Props) {
  // 中身が空のグループは表示しない
  const skillGroups = SKILL_GROUPS.map((group) => ({
    label: group.label,
    items: skills.filter((skill) => group.categories.includes(skill.category)),
  })).filter((group) => group.items.length > 0)

  return (
    <section id="about" className="px-5 py-24 md:px-16 md:py-32">
      {/* 最大幅を狭めて、中身全体を中央にまとめる */}
      <div className="mx-auto max-w-4xl">
        {/* ===== 見出し ===== */}
        <FadeIn>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-brand md:text-3xl">
            ABOUT .
          </h2>
        </FadeIn>

        {/* ===== プロフィール ===== */}
        <FadeIn className="mt-10 grid items-start gap-10 md:mt-14 md:grid-cols-[300px_1fr] md:gap-14">
          {profile.avatarUrl && (
            <div className="mx-auto w-60 md:mx-0 md:w-full">
              <Image
                src={profile.avatarUrl}
                alt={`${profile.name}のイラスト`}
                width={300}
                height={354}
                sizes="(min-width: 768px) 300px, 240px"
                className="h-auto w-full object-contain mix-blend-multiply"
              />
            </div>
          )}

          <div>
            <div className="border-l-4 border-brand pl-4 md:pl-5">
              <p className="text-lg tracking-wide md:text-xl">
                {profile.name}
                <span className="ml-4 font-heading text-base md:ml-6 md:text-lg">{profile.nameEn}</span>
              </p>
              <p className="mt-2 text-sm tracking-wide md:text-base">宮城県仙台市出身</p>
            </div>

            <p className="mt-10 whitespace-pre-line text-sm leading-loose tracking-wide md:mt-12 md:text-base md:leading-loose">
              {profile.bio}
            </p>
          </div>
        </FadeIn>

        {/* ===== 経歴 ===== */}
        <div className="relative mt-24 md:mt-28">
          <h3 className="sr-only">経歴</h3>
          {/* 左の赤い縦線（01.の上端から04.の下端まで） */}
          <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-1 bg-brand" />

          <ol className="space-y-12 pl-6 md:space-y-14 md:pl-12">
            {CAREER.map((item, index) => (
              <li key={item.title}>
                <FadeIn
                  delay={index * 120}
                  className="grid grid-cols-[auto_1fr] items-end gap-x-5 md:gap-x-8"
                >
                  <span className="font-heading text-3xl font-bold leading-none text-brand md:text-4xl">
                    {String(index + 1).padStart(2, '0')} .
                  </span>
                  <div>
                    <p className="text-sm tracking-wide md:text-base">{item.title}</p>
                    <p className="mt-1 pl-2 text-xs tracking-wide text-ink/80 md:text-sm">
                      {item.detail}
                    </p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>

        {/* ===== スキル ===== */}
        <div className="mt-24 md:mt-28">
          <FadeIn>
            <h3 className="flex items-center gap-3 font-heading text-xl text-ink md:text-2xl">
              SKILLS
              <span aria-hidden="true" className="h-px w-4 bg-ink" />
            </h3>
          </FadeIn>

          <dl className="mt-8 space-y-6 md:mt-10">
            {skillGroups.map((group, index) => (
              <FadeIn
                key={group.label}
                delay={index * 150}
                className="flex flex-col gap-3 md:flex-row md:items-center md:gap-10"
              >
                <dt className="w-40 shrink-0 rounded-full bg-white py-3 text-center font-heading text-sm tracking-wide text-navy">
                  {group.label}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2 font-nav text-sm md:text-base">
                    {group.items.map((skill) => (
                      <li key={skill.id}>{skill.name}</li>
                    ))}
                  </ul>
                </dd>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}