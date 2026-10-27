import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'

export default function ContactSection() {
  return (
    <section id="contact" className="px-5 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-brand md:text-3xl">
            CONTACT .
          </h2>
        </FadeIn>

        <FadeIn delay={150} className="mt-10 pl-6 md:mt-12 md:pl-10">
          <p className="text-sm tracking-wide text-navy md:text-base">
            お問い合わせはこちらからお気軽にご連絡ください
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-brand px-10 py-3 text-sm font-bold tracking-wide text-white transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:mt-10"
          >
            お問い合わせはこちら →
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}