import { Profile } from '@/types'
import FadeIn from '@/components/ui/FadeIn'

type Props = {
  profile: Profile
}

// エンジニアとして大切にしていること
const MESSAGE_LINES = [
  '話を聴くことから、ものづくりを始める。',
  '本当に必要なものを、使う人と一緒に形にしていきます。',
]

export default function HeroSection({ profile }: Props) {
  // 「Mika Takahashi」を「Mika」と「Takahashi」の2行に分ける
  const [firstName, ...restNames] = profile.nameEn.trim().split(/\s+/)
  const lastName = restNames.join(' ')

  return (
    <>
      {/* ===== ヒーロー ===== */}
      <section
        aria-label="トップ"
        className="flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center px-5 pb-10 md:px-16"
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* 右側に縦書きの「Web Engineer」を置くぶん、幅を少し空ける */}
          <div className="relative w-[calc(100%-2rem)] max-w-[870px] md:w-[calc(100%-3rem)]">
            {/* 文字は左上に寄せて、枠の下に空白を取る */}
            <div className="border-4 border-brand/85 px-5 pb-20 pt-5 md:border-[5px] md:px-8 md:pb-36 md:pt-7">
              <h1 className="font-display text-[clamp(2.25rem,9vw,6rem)] leading-[0.92] text-brand">
                {firstName}
                {lastName && (
                  <>
                    <br />
                    {lastName}
                  </>
                )}
              </h1>
              <p className="mt-2 pl-1 font-heading text-lg text-brand md:mt-3 md:pl-2 md:text-2xl">
                portfolio
              </p>
            </div>

            {/* 縦書きは行の高さが横幅になるので、leading-noneで文字の左右の余白をなくす */}
            <p className="absolute bottom-0 left-full ml-0.5 font-heading text-xs leading-none text-brand [writing-mode:vertical-rl] md:text-xl">
              Web Engineer
            </p>
          </div>

          {/* スクロールの合図。押すと下の文章まで移動する */}
          <a
            href="#message"
            aria-label="下へスクロール"
            className="mt-12 block h-5 w-6 bg-brand [clip-path:polygon(0_0,100%_0,50%_100%)] md:mt-16 md:h-6 md:w-7"
          />
        </div>
      </section>

      {/* ===== エンジニアとして大切にしていること ===== */}
      <section
        id="message"
        aria-label="大切にしていること"
        className="px-5 py-24 md:px-16 md:py-40"
      >
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-loose tracking-wide text-ink md:text-xl md:leading-loose">
            {MESSAGE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </FadeIn>
      </section>
    </>
  )
}