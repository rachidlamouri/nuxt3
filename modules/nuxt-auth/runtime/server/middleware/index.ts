import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { FilterXSS } from 'xss'
import { createUserSession, createSessionKey, verifySessionKey, getUserSession } from '#auth'
import { findById } from '~/server/controllers/v1/factory'
import { userRepository, EntityId } from '~/server/redisSchemas/user'

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
  let secret = getCookie(event, config.nuxtAuth.sessionCookieName)

  // console.log('SECRETffff', secret)
  if (!secret) {
    secret = randomUUID()
    await createUserSession(event, secret)
  }
  // console.log('Secret', secret)
  // console.log(await storage)
  // console.log('SESSION', session)

  // secret = randomUUID()
  // console.log(secret)
  // setCookie(event, config.nuxtAuth.sessioCookieKey, secret, config.nuxtAuth.cookieOpts as CookieSerializeOptions)

  Object.defineProperty(event.node.res, '_sessionToken', {
    value: createSessionKey(secret),
    enumerable: true,
  })
  // console.log('RES', event.node.res._csrftoken)

  // const sessionKey = parseCookies(event)[config.nuxtAuth.session.userSessionId]
  // // console.log('User session ID', sessionKey)
  // if (!sessionKey) return
  // const session = await getUserSession(event)
  // if (!session) return
  // const user = await findById(userRepository, session.userId)
  // if (!user) return
  // event.context.user = user
  // event.context.sessionKey = sessionKey

  // Object.defineProperty(event.node.res, '_sessionKey', {
  //   value: sessionKey,
  //   enumerable: true,
  // })
  // console.log('NUXT', await readBody(event))
  // nuxtApp.payload.csrfToken

  // console.log('METHOD', event.node.req.url)

  // const method = event.node.req.method ?? ''
  // if (!config.nuxtAuth.csrf.methodsToProtect.includes(method)) {
  //   return
  // }

  // console.log('HHHHHHHHHH', event.node.req.url, event.node.req.method)
  // if (event.node.req.method==='GET') return

  if (!event.node.req.url?.includes('api/v1')) return
  const headerSessionToken = getHeader(event, 'sessionToken') ?? ''
  const body = event.node.req.method !== 'GET' ? await readBody(event) : null
  // console.log('DATA', body)
  // console.log('HEADER', headerSessionToken)
  // console.log('VERIFY', verifySessionKey(secret, headerSessionToken))

  if (!verifySessionKey(secret, headerSessionToken))
    throw createError({
      statusCode: 403,
      name: 'CSRFError',
      statusMessage: 'Bad request',
      data: { code: 'hedaer_session_token_missing' },
    })

  if (body && (!body.sessionToken || body.sessionToken !== headerSessionToken))
    throw createError({
      statusCode: 403,
      name: 'CSRFError',
      statusMessage: 'Bad request',
      data: { code: 'hedaer_body_ession_token_mismatch' },
    })

  const xxsValidator = new FilterXSS(config.nuxtAuth.xss)
  if (body && JSON.stringify(body) !== xxsValidator.process(JSON.stringify(body))) {
    throw createError({
      statusCode: 403,
      name: 'XXSError',
      statusMessage: 'Bad request',
      data: { code: 'xxs_attempt' },
    })
  }
  // const session = await getUserSession(event)

  // console.log('ZZZZZZZZZZZZ', session)
})
