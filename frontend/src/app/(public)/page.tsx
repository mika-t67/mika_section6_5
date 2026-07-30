import { getProfile, getSkills, getAchievements } from '@/lib/api'
import { mockProfile, mockSkills, mockAchievements } from '@/lib/mockData'
import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'
import WorksSection from '@/components/sections/WorksSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'

// 管理画面での更新を即座に反映させるため、リクエストごとにサーバーで描画する
// （既定では静的生成され、ビルド時点のデータで固定されてしまう）
export const dynamic = 'force-dynamic'

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
      <SkillsSection skills={skills.length > 0 ? skills : mockSkills} />
      <WorksSection achievements={achievements.length > 0 ? achievements : mockAchievements} />
      <ContactSection />
      <Footer />
    </main>
  )
}