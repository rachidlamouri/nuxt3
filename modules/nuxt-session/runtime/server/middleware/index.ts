import { H3Event } from 'h3'
import { createStorage } from 'unstorage'

import memoryDriver from 'unstorage/drivers/memory'
import mongodbDriver from 'unstorage/drivers/mongodb'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

import { createUser, getSinedJwtToken } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()

const storage = createStorage({
  driver: mongodbDriver({
    connectionString: useRuntimeConfig().dbUrl,
    databaseName: 'acs',
    collectionName: 'sessions',
  }),
})

// console.log('SSSSSS', storage)

// import { dropStorageSession, getStorageSession, setStorageSession } from './storage'

import { nanoid } from 'nanoid'
import { getHashedIpAddress } from './ipPinning'

const SESSION_COOKIE_NAME = 'sessionId'

const safeSetCookie = (event: H3Event, name: string, value: string, createdAt: Date) => {
  const sessionOptions = useRuntimeConfig().session.session
  const expirationDate = sessionOptions.expiryInSeconds
    ? new Date(createdAt.getTime() + sessionOptions.expiryInSeconds * 1000)
    : undefined

  // console.log('here')

  setCookie(event, name, value, {
    // Set cookie expiration date to now + expiryInSeconds
    expires: expirationDate,
    // Wether to send cookie via HTTPs to mitigate man-in-the-middle attacks
    secure: sessionOptions.cookieSecure,
    // Wether to send cookie via HTTP requests and not allowing access of cookie from JS to mitigate XSS attacks
    httpOnly: sessionOptions.cookieHttpOnly,
    // Do not send cookies on many cross-site requests to mitigates CSRF and cross-site attacks, see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax
    sameSite: sessionOptions.cookieSameSite,
    // Set cookie for subdomain
    domain: sessionOptions.domain || undefined,
  })
}

const newSession = async (event: H3Event) => {
  const abstractRes = (await $fetch(`${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`)) || { ip_address: '' }
  console.log('IPPPPPPPPPPP', 'abstractRes')

  const jwtToken = await getSinedJwtToken('', Number(config.jwtSignupTokenMaxAge))
  // console.log('IPPPPPPPPPPP', jwtToken)

  const sessionOptions = config.session.session
  // const now = new Date()

  // (Re-)Set cookie
  // const sessionId = nanoid(sessionOptions.idLength)
  safeSetCookie(event, SESSION_COOKIE_NAME, jwtToken, new Date())

  // console.log('There')

  // Store session data in storage
  const session = {
    // jwtToken,
    ip: '',
    // ip: '',
    // city: abstractRes.city || '',
  }

  await storage.setItem(jwtToken, session)
  // console.log('HAS', await storage.hasItem(SESSION_COOKIE_NAME))
  // console.log('GET', await storage.getItem(SESSION_COOKIE_NAME))

  event.context.sessionId = jwtToken
  event.context.session = session

  return session
}

export default eventHandler(async (event: H3Event) => {
  // const sessionOptions = config.session.session

  // 1. Does the sessionId cookie exist on the request?
  const UserSessionId = parseCookies(event).userSessionId
  console.log('User session ID', UserSessionId)
  // console.log('event cookie', event.context)
  // if (event.node.req.headers.sessionauthorization) console.log('event ', event.node.req.headers)
  // const clientSession = await mongoClient.db().collection('sessions').findOne({ key: clientSessionId })
  // console.log('US', clientSession)
  // if (!clientSessionId && !event.context.sessionId && clientSessionId !== event.context.sessionId && !clientSession)
  //   newSession(event)

  // if (!clientSessionId)

  // }
  // const eventSessionId = event.context.sessionId
  // // const clientSessionId = parseCookies(event).sessionId
  // console.log('event Cookie', eventSessionId)
  // return newSession(event)
  // // 1. Ensure that a session is present by either loading or creating one
  // await ensureSession(event)
  // // 2. Setup a hook that saves any changed made to the session by the subsequent endpoints & middlewares
  // event.res.on('finish', async () => {
  //   // Session id may not exist if session was deleted
  //   const session = await getSession(event)
  //   if (!session) {
  //     return
  //   }
  //   await setStorageSession(session.id, event.context.session)
  // })
})
