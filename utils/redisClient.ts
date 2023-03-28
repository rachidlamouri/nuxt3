import { createClient } from 'redis'

const redis = createClient({
  url: process.env.NUXT_REDIS_URL as string,
})

export { redis }
