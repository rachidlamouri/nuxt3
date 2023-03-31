import { H3Event } from 'h3'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { createStorage } from 'unstorage'
import { nanoid } from 'nanoid'
// import { getHashedIpAddress } from './ipPinning'
import memoryDriver from 'unstorage/drivers/memory'
import mongodbDriver from 'unstorage/drivers/mongodb'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

import { createUser, getSinedJwtToken } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()
const sessionOptions = config.yrlNuxtAuth.session

export const storage = createStorage({
  driver: mongodbDriver({
    connectionString: config.dbUrl,
    databaseName: 'acs',
    collectionName: 'sessions',
  }),
})
// console.log('STORAGE', storage)
// const unwatch = await storage.watch((event, key) => {
//   console.log('Storage watching')
// })

const newSession = async (event: H3Event) => {
  const sessionId = nanoid()
  // // Fetch IP address
  // const abstractRes: { ip_address: string } = (await $fetch(
  //   `${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`
  // )) || { ip_address: '' }
  // const ipAddress = abstractRes.ip_address ?? nanoid(sessionOptions.idLength)

  // Create JWT token based on address or random number
  const jwtToken = jwt.sign({ sessionId }, config.yrlNuxtAuth.jwtSecret, {
    expiresIn: Number(sessionOptions.expiryInSeconds),
  })
  setCookie(event, sessionOptions.cookieName, jwtToken, {
    expires: sessionOptions.expiryInSeconds
      ? new Date(Date.now() + Number(sessionOptions.expiryInSeconds) * 1000)
      : undefined,
    secure: sessionOptions.cookieSecure,
    httpOnly: sessionOptions.cookieHttpOnly,
    sameSite: sessionOptions.cookieSameSite,
    domain: sessionOptions.domain || undefined,
  })

  // Store session data in storage
  const session = {
    sessionId,
    ip: '',
  }

  await storage.setItem(jwtToken, session)
  // await storage.setMeta(sessionId, { jwtToken, ip: 'ipAddress' })
  event.context.sessionId = sessionId
  event.context.session = session

  return session
}

const getSession = async (event: H3Event) => {
  // 1. Does the sessionId  exist on the request?
  const sessionId = parseCookies(event)[sessionOptions.cookieName]
  // console.log('SESSIONID', sessionId)

  let session
  if (!sessionId) session = await newSession(event)
  else session = await storage.getItem(sessionId)

  // console.log('SESSION', session)

  // else session = (await storage.hasItem(sessionId))
  // event.context.sessionId = parseCookies(event)[sessionOptions.cookieName]
  event.context.sessionMeta = session && (await storage.hasItem(sessionId)) ? await storage.getMeta(sessionId) : {}
  return session

  // return await storage.getItem(sessionId)
  // const session = await newSession(event)
  // const sessionIdContext = event.context.sessionId

  // if (sessionIdContext && requestSessionId && sessionIdContext !== requestSessionId) {
  //   return null
  // }

  // return requestSessionId || sessionIdContext || null
  // const currentSessionId = getCurrentSessionId(event)
  // if (!existingSessionId) {
  //   return null
  // }
}

export default eventHandler(async (event) => {
  let session = await getSession(event)
  // console.log('SSSSS', session)
  return

  // Object.defineProperty(event.node.res, '_csrftoken', {
  //   value: createCsrf(secret),
  //   enumerable: true,
  // })

  // console.log('DDDDD', session)

  // if (!session) session = console.log(session)

  // if (!session) {
  // await newSession(event)
  // } else if (sessionOptions.rolling) {
  //   session = updateSessionExpirationDate(session, event)
  // }

  // event.context.sessionId = session.id
  // event.context.session = session
  // return session
  // // const sessionOptions = config.yrlNuxtAuth.session
  // console.log('HHJJJKKKKKLL:')
  // console.log(await newSession(event))

  // 1. Does the sessionId cookie exist on the request?
  // const clientSessionId = parseCookies(event).sessionId
  // console.log('client Cookie', clientSessionId)
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
