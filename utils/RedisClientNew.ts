import { createClient } from 'redis'

class RedisClient {
  // custom: boolean
  client: any
  constructor(url: string) {
    this.client = createClient({ url })
  }

  async connect() {
    await this.client.connect()
  }

  async disconnect() {
    await this.client.disconnect()
  }
}

export default new RedisClient(process.env.NUXT_REDIS_URL as string)
