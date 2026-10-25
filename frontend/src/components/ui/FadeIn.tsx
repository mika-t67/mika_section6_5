'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useFadeIn } from '@/hooks/useFadeIn'

type Props = {
  children: ReactNode
  /** 表示を遅らせる時間（ミリ秒）。順番に表示したいときに使う */
  delay?: number
  className?: string
}

export default function FadeIn({ children, delay = 0, className = '' }: Props) {
  const ref = useFadeIn<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`fade-in ${className}`}
      style={{ '--fade-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}