// import { createClient } from 'redis'

// const redis = createClient({
//   url: process.env.NUXT_REDIS_URL as string,
// })

// redis.on('error', (err: Error) => console.log('Redis Client Error', err))
// redis.on('connect', () => console.log('redis connection succesfull'))

// export { redis }

// import { createClient } from 'redis'

// const connect = async () => {
//   const redisClient = createClient({
//     url: process.env.NUXT_REDIS_URL as string,
//   })
//   redisClient.on('error', (err: Error) => console.log('Redis Client Error', err))
//   redisClient.on('connect', () => console.log('redis connection succesfull'))
//   await redisClient.connect()
// }

// export default  redisClient
