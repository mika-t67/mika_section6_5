import Redis from 'ioredis'
 
//Redisへ接続
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
 
redis.on('connect', () => {
  console.log('Redis connected') //これが出たら接続成功
})
 
redis.on('error', (err) => {
  console.error('Redis error:', err)
})
 
export default redis