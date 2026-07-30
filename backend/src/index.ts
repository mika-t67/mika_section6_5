import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import profileRouter from './routes/profile'
import skillsRouter from './routes/skills'
import achievementsRouter from './routes/achievements'
import contactRouter from './routes/contact'

const app = express()
const PORT = process.env.PORT || 3001

// 許可するオリジンを環境変数から読み込む（カンマ区切り）
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // curl や Postman など Origin ヘッダを持たないリクエストは許可
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`許可されていないオリジンです: ${origin}`))
    },
  })
)
app.use(express.json())

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// ルーティング
app.use('/profile', profileRouter)
app.use('/skills', skillsRouter)
app.use('/achievements', achievementsRouter)
app.use('/contact', contactRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`許可オリジン: ${allowedOrigins.join(', ')}`)
})