import { getProfile, getSkills, getAchievements } from '@/lib/api'
import { mockProfile, mockSkills, mockAchievements } from '@/lib/mockData'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
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

  const safeProfile = profile ?? mockProfile
  const safeSkills = skills.length > 0 ? skills : mockSkills
  const safeAchievements = achievements.length > 0 ? achievements : mockAchievements

  return (
    <main className="min-h-screen">
      <HeroSection profile={safeProfile} />
      <AboutSection profile={safeProfile} skills={safeSkills} />
      <FadeIn>
        <WorksSection achievements={safeAchievements} />
      </FadeIn>
      <FadeIn>
        <ContactSection />
      </FadeIn>
      <Footer />
    </main>
  )
}