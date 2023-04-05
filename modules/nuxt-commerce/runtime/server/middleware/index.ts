import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { FilterXSS } from 'xss'
import { createSessionKey, verifySessionKey, getUserSession, fetcheSessionUser } from '#auth'
import { findById } from '~/server/controllers/v1/factory'
import { userRepository, EntityId } from '~/server/redisSchemas/user'
import { ISession, IUser } from '~/utils/schema'
import { H3Event } from 'h3'
import { QueryObject } from 'ufo'

const config = useRuntimeConfig()
// const nuxtApp = useNuxtApp()
const secrefBuffer = Buffer.from(config.nuxtAuth.csrf.encryptSecret)

// const createCsrf = (secret: string): string => {
//   const iv = randomBytes(16)
//   const cipher = createCipheriv(config.nuxtAuth.csrf.encryptAlgorithm, secrefBuffer, iv)
//   const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
//   return `${iv.toString('base64')}:${encrypted}`
// }

export default defineEventHandler(async (event) => {
  // Get session cookie

  console.log('commerce middleware')
})
