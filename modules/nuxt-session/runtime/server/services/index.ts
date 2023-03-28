import AppError from '~/utils/AppError'
import { H3Event } from 'h3'
import { Ref, ref } from 'vue'
import { createStorage } from 'unstorage'

import memoryDriver from 'unstorage/drivers/memory'
import mongodbDriver from 'unstorage/drivers/mongodb'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

import { createUser, getSinedJwtToken } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()
// const nuxtApp = useNuxtApp()
// console.log(nuxtApp)

const storage = createStorage({
  driver: mongodbDriver({
    connectionString: useRuntimeConfig().dbUrl,
    databaseName: 'acs',
    collectionName: 'sessions',
  }),
})

// const storage = createStorage({
//   driver: memoryDriver(),
// })

export const setUserSession = async (event: H3Event, userId: string) => {
  // const abstractRes = (await $fetch(`${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`)) || { ip_address: '' }
  // console.log('IPPPPPPPPPPP', 'abstractRes')

  const jwtToken = await getSinedJwtToken({ userId }, Number(config.jwtSignupTokenMaxAge))
  console.log('IPPPPPPP', jwtToken)
  // return jwtToken

  const expirationDate = config.nuxtSession.expiryInSeconds
    ? new Date(Date.now() + config.nuxtSession.expiryInSeconds * 1000)
    : undefined

  // console.log('here')

  setCookie(event, config.nuxtSession.userSessionCookyName, jwtToken, {
    expires: expirationDate,
    secure: config.nuxtSession.cookieSecure,
    httpOnly: config.nuxtSession.cookieHttpOnly,
    sameSite: config.nuxtSession.cookieSameSite,
    domain: config.nuxtSession.domain || undefined,
  })
  // const now = new Date()

  // (Re-)Set cookie
  // const sessionId = nanoid(config.nuxtSession.idLength)
  // safeSetCookie(event, SESSION_COOKIE_NAME, jwtToken, new Date())

  // console.log('There')

  // Store session data in storage
  const session = {
    jwtToken,
    ip: '989076',
    // ip: '',
    // city: abstractRes.city || '',
  }

  await storage.setItem(jwtToken, session)
  // console.log('HAS', await storage.hasItem(SESSION_COOKIE_NAME))
  // console.log('GET', await storage.getItem(SESSION_COOKIE_NAME))

  // event.context.sessionId = jwtToken
  // event.context.session = session

  return session
}

export const getUserSession = async (event: H3Event) => {
  let session
  const userSessionId = parseCookies(event)[config.nuxtSession.userSessionCookyName]
  console.log('User session ID', userSessionId)
  console.log('HAS', await storage.hasItem(userSessionId))
  if (await storage.hasItem(userSessionId)) session = await storage.getItem(userSessionId)
  console.log('SSSSSS', session)
  return session
}
