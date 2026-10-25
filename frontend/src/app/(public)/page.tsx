import { getProfile, getSkills, getAchievements } from '@/lib/api'
import { mockProfile, mockSkills, mockAchievements } from '@/lib/mockData'
import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'
import WorksSection from '@/components/sections/WorksSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import FadeIn from '@/components/ui/FadeIn'

export default async function HomePage() {
  // APIからデータ取得、失敗時はモックデータにフォールバック
  const [profile, skills, achievements] = await Promise.all([
    getProfile().catch(() => mockProfile),
    getSkills().catch(() => mockSkills),
    getAchievements().catch(() => mockAchievements),
  ])

  return (
    <main className="min-h-screen text-stone-800">
      <HeroSection profile={profile ?? mockProfile} />
      <FadeIn>
        <SkillsSection skills={skills.length > 0 ? skills : mockSkills} />
      </FadeIn>
      <FadeIn>
        <WorksSection achievements={achievements.length > 0 ? achievements : mockAchievements} />
      </FadeIn>
      <FadeIn>
        <ContactSection />
      </FadeIn>
      <Footer />
    </main>
  )
}