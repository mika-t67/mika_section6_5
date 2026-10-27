import { writeFile } from 'node:fs/promises'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const OUT = new URL('../src/lib/mockData.ts', import.meta.url)

const get = async (path) => {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(`${path} が ${res.status} を返しました`)
  return res.json()
}

// DBはタグをカンマ区切りの文字列で持っているため配列に変換する
const toTagArray = (tags) => {
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') return tags.split(',').map((t) => t.trim()).filter(Boolean)
  return []
}

const main = async () => {
  const [profile, skills, achievements] = await Promise.all([
    get('/profile'),
    get('/skills'),
    get('/achievements'),
  ])

  // 空データで生成してしまうと意味がないので止める
  if (!profile) throw new Error('プロフィールが未登録です')
  if (!skills.length) throw new Error('スキルが0件です')
  if (!achievements.length) throw new Error('実績が0件です')

  const cleanProfile = {
    id: profile.id,
    name: profile.name,
    nameEn: profile.nameEn,
    role: profile.role,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl ?? '/images/avatar.svg',
    email: profile.email,
    ...(profile.twitterUrl ? { twitterUrl: profile.twitterUrl } : {}),
    ...(profile.githubUrl ? { githubUrl: profile.githubUrl } : {}),
  }

  const cleanSkills = skills.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    level: s.level,
  }))

  const cleanAchievements = achievements.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    imageUrl: a.imageUrl ?? '',
    imageAlt: a.imageAlt ?? null,
    tags: toTagArray(a.tags),
    ...(a.url ? { url: a.url } : {}),

    // 一覧の表示用
    device: a.device === 'mobile' ? 'mobile' : 'pc',
    sortOrder: typeof a.sortOrder === 'number' ? a.sortOrder : 0,

    // 詳細ページ用
    devType: a.devType ?? null,
    period: a.period ?? null,
    role: a.role ?? null,
    techReason: a.techReason ?? null,
    challenge: a.challenge ?? null,
    githubUrl: a.githubUrl ?? null,

    createdAt: typeof a.createdAt === 'string' ? a.createdAt.slice(0, 10) : a.createdAt,
  }))

  const j = (v) => JSON.stringify(v, null, 2)

  const content = `import { Profile, Skill, Achievement } from '@/types'

// このファイルは scripts/generate-fallback.mjs による自動生成です。
// APIに接続できない場合／データが0件の場合の表示内容として使われます。
// 内容を更新するには、バックエンドを起動した状態で次を実行してください:
//   npm run generate:fallback

export const mockProfile: Profile = ${j(cleanProfile)}

export const mockSkills: Skill[] = ${j(cleanSkills)}

export const mockAchievements: Achievement[] = ${j(cleanAchievements)}
`

  await writeFile(OUT, content, 'utf8')
  console.log(`✅ 生成しました（スキル ${cleanSkills.length} 件 / 実績 ${cleanAchievements.length} 件）`)
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})