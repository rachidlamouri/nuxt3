import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'

const config = useRuntimeConfig()
// console.log(config.auth)
const secrefBuffer = Buffer.from(config.auth.encryptSecret)

/**
 * Create a new CSRF token (encrypt secret using csrfConfig.encryptAlgorithm)
 */
const createCsrf = (secret: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(config.auth.csrfEncryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

export default defineEventHandler((event) => {
  console.log('RES', event.node.res._csrftoken)
  // if (process.server) console.log('MIddleware', event.node.req.method)
  let secret = getCookie(event, config.auth.csrfCookieKey)
  console.log('SECRET', secret)
  if (!secret) {
    secret = randomUUID()
    setCookie(event, config.auth.csrfCookieKey, secret, config.auth.csrfCookieOpts)
  }
  Object.defineProperty(event.node.res, '_csrftoken', {
    value: createCsrf(secret),
    enumerable: true,
  })
  console.log('RES1', event.node.res._csrftoken)
})
