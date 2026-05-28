// src/components/sections/HeroSection.tsx
import { Poppins } from 'next/font/google'
import { Profile } from '@/types'
import Image from 'next/image'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300'],
})

type Props = {
  profile: Profile
}

export default function HeroSection({ profile }: Props) {
  return (
    <section className="relative flex min-h-screen items-center bg-[#f9f8f6] px-6 py-24 md:px-16">
      {/* 背景の有機的な装飾 */}
      <div
        className="pointer-events-none absolute right-[-80px] top-[-60px] h-[420px] w-[420px] bg-stone-200/50"
        style={{ borderRadius: '60% 40% 40% 60% / 60% 40% 60% 40%' }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-16 md:flex-row">
        {/* テキスト */}
        <div className="flex-1 space-y-8">
          <p className="text-sm tracking-[0.3em] text-stone-400 uppercase">
            {profile.role}
          </p>
          <h1 className={`${poppins.className} text-5xl font-light leading-tight tracking-tight text-stone-700 md:text-6xl`}>
            {profile.nameEn}
          </h1>
          <p className="whitespace-pre-line text-base leading-relaxed text-stone-500">
            {profile.bio}
          </p>
          <div className="flex gap-6 pt-4">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-widest text-stone-400 underline-offset-4 transition hover:text-stone-700 hover:underline"
              >
                GitHub
              </a>
            )}
            {profile.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-widest text-stone-400 underline-offset-4 transition hover:text-stone-700 hover:underline"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        {/* アバター（有機的な形） */}
        <div className="relative flex-shrink-0">
          <div
            className="h-64 w-64 overflow-hidden bg-stone-200 md:h-80 md:w-80"
            style={{ borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%' }}
          >
            <Image
              src={profile.avatarUrl ?? ''}
              alt={profile.name}
              width={320}
              height={320}
              className="h-full w-full object-cover"
            />
          </div>
          <div
            className="absolute -bottom-4 -right-4 -z-10 h-64 w-64 bg-stone-100 md:h-80 md:w-80"
            style={{ borderRadius: '45% 55% 60% 40% / 55% 45% 55% 45%' }}
          />
        </div>
      </div>
    </section>
  )
}

