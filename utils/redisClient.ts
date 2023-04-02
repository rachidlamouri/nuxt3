import { createClient } from 'redis'

const redis = createClient({
  url: process.env.NUXT_REDIS_URL as string,
})

redis.on('error', (err: Error) => console.log('Redis Client Error', err))
redis.on('connect', () => console.log('redis connection succesfull'))

export { redis }
