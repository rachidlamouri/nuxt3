import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { FilterXSS } from 'xss'
import { createUserSession, createSessionKey, verifySessionKey, getUserSession, fetcheSessionUser } from '#auth'
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
  let secret = getCookie(event, config.nuxtAuth.sessionCookieName)

  // If no session cookie, create session cookie and session
  // If there is a cookie and no sesssion then create session
  if (!secret) {
    secret = randomUUID()
    await createUserSession(event, secret)
  } else {
    const session = await getUserSession(event)
    if (!session || !Object.values(session).length) await createUserSession(event, secret)
  }

  // Encrypt session cookie and add it to event response (To be exposed to front end in plugin)
  Object.defineProperty(event.node.res, '_sessionToken', {
    value: createSessionKey(secret),
    enumerable: true,
  })

  // Retreive user info from session if it exists, fetch user and add it to event contexts (used to protect routes} down stream
  // Add user info (ID, ULID, name and authenticated) to event response (to be exposed to front end in plugin)
  const user = await fetcheSessionUser(event)
  if (user && Object.values(user).length) {
    event.context.user = user
    Object.defineProperty(event.node.res, '_sessionUser', {
      value: { userName: user.name, authenticated: true },
      enumerable: true,
    })
  }

  // Bail if event req does not include qpi/v
  if (!event.node.req.url?.includes('api/v')) return

  // Retreive sessioncookie from header
  // Decrypt header cookie and veiry that it matches the secret
  const headerSessionToken = getHeader(event, 'sessionToken') ?? ''
  if (!verifySessionKey(secret, headerSessionToken))
    throw createError({
      statusCode: 403,
      name: 'CSRFError',
      statusMessage: 'Bad request',
      data: { code: 'hedaer_session_token_missing' },
    })

  // Retreive body if request method is not GET
  // Decrypt body session token (same token = cookie is sent via header and body if it is not a get s request)  and veiry that it matches the secret
  const body = event.node.req.method !== 'GET' ? await readBody(event) : null
  if (body && (!body.sessionToken || !verifySessionKey(secret, body.sessionToken)))
    throw createError({
      statusCode: 403,
      name: 'CSRFError',
      statusMessage: 'Bad request',
      data: { code: 'hedaer_body_ession_token_mismatch' },
    })

  // Retreive params i request method is  GET
  // Decrypt params session token (same token = cookie is sent via header and params if it is a get request)  and veiry that it matches the secret
  const params = event.node.req.method === 'GET' ? getQuery(event) : null
  if (params && (!params.sessionToken || !verifySessionKey(secret, (params as QueryObject).sessionToken)))
    throw createError({
      statusCode: 403,
      name: 'CSRFError',
      statusMessage: 'Bad request',
      data: { code: 'hedaer_body_ession_token_mismatch' },
    })

  //Sanitise request body
  const xxsValidator = new FilterXSS(config.nuxtAuth.xss)
  if (body && JSON.stringify(body) !== xxsValidator.process(JSON.stringify(body))) {
    throw createError({
      statusCode: 403,
      name: 'XXSError',
      statusMessage: 'Bad request',
      data: { code: 'xxs_attempt' },
    })
  }

  console.log('ZZZZZZZZZZZZ')
})
