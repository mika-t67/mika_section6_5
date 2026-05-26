import { Profile, Skill, Achievement } from '@/types'
 
export const mockProfile: Profile = {
  id: 1,
  name: '山田 花子',
  nameEn: 'Hanako Yamada',
  role: 'Frontend Developer & Designer',
  bio: 'デザインとコードの境界を探求するフロントエンドエンジニア。\n余白と有機的なかたちが好きです。',
  avatarUrl: '/images/avatar.svg',
  email: 'hello@example.com',
  twitterUrl: 'https://twitter.com/example',
  githubUrl: 'https://github.com/example',
}
 
export const mockSkills: Skill[] = [
  { id: 1, name: 'React', category: 'frontend', level: 4 },
  { id: 2, name: 'Next.js', category: 'frontend', level: 4 },
  { id: 3, name: 'TypeScript', category: 'frontend', level: 3 },
  { id: 4, name: 'Tailwind CSS', category: 'frontend', level: 4 },
  { id: 5, name: 'Figma', category: 'design', level: 4 },
  { id: 6, name: 'Node.js', category: 'backend', level: 3 },
  { id: 7, name: 'Prisma', category: 'backend', level: 2 },
  { id: 8, name: 'MySQL', category: 'backend', level: 2 },
]
 
export const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: 'ポートフォリオサイト',
    description: 'Next.js + Tailwind CSS で制作した自身のポートフォリオ。ミニマルで有機的なデザインを意識しました。',
    imageUrl: '/images/works/work1.svg',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    url: 'https://example.com',
    createdAt: '2024-04-01',
  },
  {
    id: 2,
    title: 'タスク管理アプリ',
    description: 'React + Firebase を使ったシンプルなタスク管理アプリ。ドラッグ&ドロップで並べ替えが可能。',
    imageUrl: '/images/works/work2.svg',
    tags: ['React', 'Firebase', 'TypeScript'],
    createdAt: '2024-01-15',
  },
  {
    id: 3,
    title: 'ECサイトLP',
    description: 'オーガニックコスメブランドのランディングページ。ナチュラルトーンの配色とアニメーションが特徴。',
    imageUrl: '/images/works/work3.svg',
    tags: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://example.com',
    createdAt: '2023-10-01',
  },
]
 