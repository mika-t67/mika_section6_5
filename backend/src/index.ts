import express from 'express'
import cors from 'cors'
import profileRouter from './routes/profile'
import skillsRouter from './routes/skills'
import achievementsRouter from './routes/achievements'
 
const app = express()
const PORT = process.env.PORT || 3001
 
app.use(cors())
app.use(express.json())
 
// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})
 
// ルーティング
app.use('/profile', profileRouter)
app.use('/skills', skillsRouter)
app.use('/achievements', achievementsRouter)
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
 