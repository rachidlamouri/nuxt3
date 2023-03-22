import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import errorHandler from '~/utils/errorHandler'
import AppError from '~/utils/AppError'

const config = useRuntimeConfig()
const secrefBuffer = Buffer.from(config.yrlNuxtAuth.encryptSecret)

const createCsrf = (secret: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(config.yrlNuxtAuth.csrfEncryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

const verifyCsrf = (secret, token) => {
  const [iv, encrypted] = token.split(':')
  if (!iv || !encrypted) {
    return false
  }
  let decrypted
  try {
    const decipher = createDecipheriv(config.yrlNuxtAuth.csrfEncryptAlgorithm, secrefBuffer, Buffer.from(iv, 'base64'))
    decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
  } catch (error) {
    return false
  }
  return decrypted === secret
}

export default defineEventHandler((event) => {
  // try {
  // if (process.server) console.log('MIddleware', event.node.req.method)
  let secret = getCookie(event, config.yrlNuxtAuth.csrfCookieKey)
  // console.log('SECRET', secret)
  if (!secret) {
    secret = randomUUID()
    setCookie(event, config.yrlNuxtAuth.csrfCookieKey, secret, config.yrlNuxtAuth.csrfCookieOpts)
  }
  Object.defineProperty(event.node.res, '_csrftoken', {
    value: createCsrf(secret),
    enumerable: true,
  })
  // useNuxtApp().payload.csrfToken = '1234'
  // console.log('!!!!!!!!!!!!', useNuxtApp().payload.csrfToken)
  // console.log('Header', getHeader(event, 'csrf-token'))

  if (getHeader(event, 'csrf-token')) console.log('MIddleware end', verifyCsrf(secret, getHeader(event, 'csrf-token')))

  const method = event.node.req.method ?? ''
  if (!config.yrlNuxtAuth.methodsToProtect.includes(method)) {
    return
  }

  const url = event.node.req.url ?? ''
  const excluded =
    config.yrlNuxtAuth.excludedUrls?.filter((el) => (Array.isArray(el) ? new RegExp(...el).test(url) : el === url))
      .length > 0
  const token = getHeader(event, 'csrf-token') ?? ''
  // console.log('token', token)
  // console.log('verify', verifyCsrf(secret, token))

  if (!excluded && verifyCsrf(secret, token)) {
    // console.log('ERR')
    // throw new AppError('Token mismatch', 'token-mismatch', 404)
    throw createError({
      statusCode: 403,
      name: 'EBADCSRFTOKEN',
      statusMessage: 'CSRF Token Mismatch',
      data: { ss: 'jdjdsjdsfjjkdkjfskjsdf' },
    })
  }

  // console.log('HHHHHHHHHHHHHHHHH')
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
})
