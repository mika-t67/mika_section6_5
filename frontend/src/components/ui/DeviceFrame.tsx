import Image from 'next/image'
import type { Device } from '@/types'

type Props = {
  device: Device
  src: string
  alt: string
  sizes: string
  /** 枠の幅（親要素に対する割合）。指定しなければ一覧用の幅 */
  className?: string
  /** 最初の画面に出る画像なら true にして、優先して読み込む */
  priority?: boolean
}

// 枠の中の画像。親に group をつけると、マウスを乗せたときに上から下へゆっくりスクロールする
const screenImageClass =
  'object-cover object-top transition-[object-position] duration-[3000ms] ease-in-out group-hover:object-bottom group-focus-visible:object-bottom motion-reduce:transition-none'

export default function DeviceFrame({ device, src, alt, sizes, className, priority = false }: Props) {
  const loadingProps = priority
    ? ({ loading: 'eager', fetchPriority: 'high' } as const)
    : ({ loading: 'lazy' } as const)

  if (device === 'mobile') {
    return (
      <div
        className={`relative aspect-[9/19] rounded-[1.6rem] bg-neutral-800 p-[5px] shadow-md ${className ?? 'w-[30%]'}`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.3rem] bg-neutral-100">
          {src && <Image src={src} alt={alt} fill sizes={sizes} className={screenImageClass} {...loadingProps} />}
        </div>
        {/* 画面上部のノッチ */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[9px] h-[5px] w-[30%] -translate-x-1/2 rounded-full bg-neutral-800"
        />
      </div>
    )
  }

  return (
    <div className={className ?? 'w-[74%]'}>
      <div className="relative aspect-[16/10] rounded-t-lg bg-neutral-800 p-[5px] pb-[7px] shadow-md">
        <div className="relative h-full w-full overflow-hidden rounded-sm bg-neutral-100">
          {src && <Image src={src} alt={alt} fill sizes={sizes} className={screenImageClass} {...loadingProps} />}
        </div>
      </div>
      {/* ノートPCの土台 */}
      <div aria-hidden="true" className="-mx-[6%] h-[10px] rounded-b-xl bg-neutral-300" />
    </div>
  )
}