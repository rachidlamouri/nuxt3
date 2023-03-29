import AppError from '~/utils/AppError'
import { H3Event } from 'h3'
import { Ref, ref } from 'vue'
import { createStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'
import mongodbDriver from 'unstorage/drivers/mongodb'
import redisDriver from 'unstorage/drivers/redis'
import { mongoClient, ObjectId } from '~/utils/mongoClient'
import { nanoid } from 'nanoid'

import { createUser, getSinedJwtToken } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()
// const nuxtApp = useNuxtApp()
// console.log(nuxtApp)

// const storage = createStorage({
//   driver: mongodbDriver({
//     connectionString: useRuntimeConfig().dbUrl,
//     databaseName: 'acs',
//     collectionName: 'sessions',
//   }),
// })

// const storage = createStorage({
//   driver: memoryDriver(),
// })

export const storage = createStorage({
  driver: redisDriver({
    base: config.nuxtSession.userSessionId,
    host: config.redisHost,
    port: Number(config.redisPort),
    password: config.redisPassword,
    // tls: true as any,
  }),
})

export const setUserSession = async (event: H3Event, userId: string) => {
  // const abstractRes = (await $fetch(`${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`)) || { ip_address: '' }
  // console.log('IPPPPPPPPPPP', 'abstractRes')
  const sessionKey = nanoid(config.nuxtSession.idLength)

  // const jwtToken = await getSinedJwtToken({ id }, Number(config.jwtSignupTokenMaxAge))
  // console.log('IPPPPPPP', jwtToken)
  // // return jwtToken

  const expirationDate = config.nuxtSession.expiryInSeconds
    ? new Date(Date.now() + config.nuxtSession.expiryInSeconds * 1000)
    : undefined

  // console.log('here')

  setCookie(event, config.nuxtSession.userSessionId, sessionKey, {
    expires: expirationDate,
    secure: config.nuxtSession.cookieSecure,
    httpOnly: config.nuxtSession.cookieHttpOnly,
    // sameSite: config.nuxtSession.cookieSameSite as 'strict',
    // domain: config.nuxtSession.domain,
  })
  // const now = new Date()

  // (Re-)Set cookie
  // const userSessionId = nanoid(config.nuxtSession.idLength)
  // safeSetCookie(event, SESSION_COOKIE_NAME, jwtToken, new Date())

  // console.log('There')

  // Store session data in storage
  const session = {
    userId,
    // jwtToken,
    // ip: '989076',
    // ip: '',
    // city: abstractRes.city || '',
  }

  await storage.setItem(sessionKey, session, { ttl: config.nuxtSession.expiryInSeconds })
  // console.log('HAS', await storage.hasItem(SESSION_COOKIE_NAME))
  // console.log('GET', await storage.getItem(SESSION_COOKIE_NAME))

  // event.context.sessionId = jwtToken
  // event.context.session = session

  return session
}

export const getUserSession = async (event: H3Event) => {
  let session
  const userSessionId = parseCookies(event)[config.nuxtSession.userSessionId]
  console.log('User session ID', userSessionId)
  console.log('HAS', await storage.hasItem(userSessionId))
  if (await storage.hasItem(userSessionId)) session = await storage.getItem(userSessionId)
  console.log('SSSSSS', session)
  return session
}
