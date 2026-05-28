// src/components/sections/WorksSection.tsx

import { Achievement } from '@/types'
import Image from 'next/image'

type Props = {
  achievements: Achievement[]
}

export default function WorksSection({ achievements }: Props) {
  return (
    <section className="bg-[#f0eeea] px-6 py-24 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 space-y-3">
          <p className="text-sm tracking-[0.3em] text-stone-400 uppercase">Works</p>
          <h2 className="text-3xl font-light text-stone-800">制作実績</h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((work) => (
            <article
              key={work.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                {work.imageUrl ? (
                  <Image
                    src={work.imageUrl}
                    alt={work.imageAlt ?? work.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-stone-300">
                    No Image
                  </div>
                )}
              </div>

              <div className="space-y-3 p-6">
                <h3 className="text-base font-medium text-stone-700">{work.title}</h3>
                <p className="text-sm leading-relaxed text-stone-400">{work.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {(typeof work.tags === 'string'
                    ? work.tags.split(',').map((t) => t.trim())
                    : work.tags ?? []
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {work.url && (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block pt-2 text-xs tracking-widest text-stone-400 underline-offset-4 transition hover:text-stone-700 hover:underline"
                  >
                    View →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
