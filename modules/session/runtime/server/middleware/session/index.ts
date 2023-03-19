import { H3Event } from 'h3'
import { createStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'
import mongodbDriver from 'unstorage/drivers/mongodb'

const config = useRuntimeConfig()

const storage = createStorage({
  driver: mongodbDriver({
    connectionString: useRuntimeConfig().dbUrl,
    databaseName: 'acs',
    collectionName: 'session',
  }),
})

// import { dropStorageSession, getStorageSession, setStorageSession } from './storage'

import { nanoid } from 'nanoid'
import { getHashedIpAddress } from './ipPinning'

const SESSION_COOKIE_NAME = 'sessionId'

const safeSetCookie = (event: H3Event, name: string, value: string, createdAt: Date) => {
  const sessionOptions = useRuntimeConfig().session.session
  const expirationDate = sessionOptions.expiryInSeconds
    ? new Date(createdAt.getTime() + sessionOptions.expiryInSeconds * 1000)
    : undefined

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
  console.log('IP', event.node.req.headers)

  const sessionOptions = config.session.session
  // const now = new Date()

  // (Re-)Set cookie
  // const sessionId = nanoid(sessionOptions.idLength)
  // safeSetCookie(event, SESSION_COOKIE_NAME, sessionId, now)

  // Store session data in storage
  const session = {
    // id: sessionId,
    createdAtnow: new Date(),
    ip: event.node.req.socket.remoteAddress,
    // ip: sessionOptions.ipPinning ? await getHashedIpAddress(event) : undefined,
  }

  console.log('STORAGE', await storage.setItem(SESSION_COOKIE_NAME, session))
  console.log('HAS', await storage.hasItem(SESSION_COOKIE_NAME))
  console.log('GET', await storage.getItem(SESSION_COOKIE_NAME))

  return session
}

export default eventHandler(async (event: H3Event) => {
  const sessionOptions = config.session.session

  // 1. Does the sessionId cookie exist on the request?
  const clientSessionId = parseCookies(event).sessionId
  console.log('client Cookie', clientSessionId)
  if (!clientSessionId) return newSession(event)

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
