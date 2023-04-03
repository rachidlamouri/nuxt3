import { createClient } from 'redis'

class RedisClient {
  // custom: boolean
  client: any
  constructor(url: string) {
    this.client = createClient({ url })
  }

  async connect() {
    this.client.on('error', (err: Error) => console.log('Redis Client Error', err))
    this.client.on('connect', () => console.log('redis connection succesfull'))
    this.client.on('reday', () => console.log('redis client is ready'))
    this.client.on('end', () => console.log('redis connection has closed'))
    await this.client.connect()
  }

  async disconnect() {
    await this.client.disconnect()
  }
}

export default new RedisClient(process.env.NUXT_REDIS_URL as string)
