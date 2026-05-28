// src/components/sections/SkillsSection.tsx

import { Skill } from '@/types'

type Props = {
  skills: Skill[]
}

const categoryLabel: Record<Skill['category'], string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  design: 'Design',
  other: 'Other',
}

const categories: Skill['category'][] = ['frontend', 'backend', 'design', 'other']

export default function SkillsSection({ skills }: Props) {
  return (
    <section className="bg-[#f4f3f0] px-6 py-24 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 space-y-3">
          <p className="text-sm tracking-[0.3em] text-stone-400 uppercase">Skills</p>
          <h2 className="text-3xl font-light text-stone-800">できること</h2>
        </div>
        <div className="space-y-12">
          {categories.map((cat) => {
            const filtered = skills.filter((s) => s.category === cat)
            if (filtered.length === 0) return null
            return (
              <div key={cat}>
                <p className="mb-6 text-xs tracking-widest text-stone-400 uppercase">
                  {categoryLabel[cat]}
                </p>
                <div className="flex flex-wrap gap-3">
                  {filtered.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full border border-stone-200 bg-white px-5 py-2 text-sm text-stone-600 shadow-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
