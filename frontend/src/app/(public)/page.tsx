import { getProfile, getSkills, getAchievements } from '@/lib/api'
import { mockProfile, mockSkills, mockAchievements } from '@/lib/mockData'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import WorksSection from '@/components/sections/WorksSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'

// 作っておいたページをすぐ返しつつ、60秒たったら裏で最新のデータに作り直す
// （管理画面での更新が、数分以内にトップページに反映される）
export const revalidate = 60

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
      <WorksSection achievements={safeAchievements} />
      <ContactSection />
      <Footer />
    </main>
  )
}