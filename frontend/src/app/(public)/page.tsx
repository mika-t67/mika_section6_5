// src/app/(public)/page.tsx

import { mockProfile, mockSkills, mockAchievements } from '@/lib/mockData'
import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'
import WorksSection from '@/components/sections/WorksSection'
import ContactSection from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f9f8f6] text-stone-800">
      <HeroSection profile={mockProfile} />
      <SkillsSection skills={mockSkills} />
      <WorksSection achievements={mockAchievements} />
      <ContactSection />
    </main>
  )
}

