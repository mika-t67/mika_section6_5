'use client'

import { useEffect, useRef } from 'react'

// ページ全体で1つの監視役を使い回す
let sharedObserver: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const target = entry.target

        if (entry.intersectionRatio >= 0.1) {
          // 要素が10%以上見えたら表示する
          // stateを使わずクラスを直接つけるので、再描画が起きない
          target.classList.add('is-visible')
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          // 画面の下に完全に出たときだけリセットする
          // （上に抜けた要素は表示したままにして、戻ったときに消えないようにする）
          target.classList.remove('is-visible')
        }
      }
    },
    {
      // 「見え始め」と「10%見えた」の2つのタイミングで通知を受け取る
      threshold: [0, 0.1],
    },
  )

  return sharedObserver
}

export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = getObserver()
    observer.observe(element)

    return () => observer.unobserve(element)
  }, [])

  return ref
}