import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { FilterXSS } from 'xss'

const config = useRuntimeConfig()
const secrefBuffer = Buffer.from(config.nuxtSecurity.csrf.encryptSecret)

const createCsrf = (secret: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(config.nuxtSecurity.csrf.encryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

const verifyCsrf = (secret: string, token: string) => {
  const [iv, encrypted] = token.split(':')
  if (!iv || !encrypted) {
    return false
  }
  let decrypted
  try {
    const decipher = createDecipheriv(
      config.nuxtSecurity.csrf.encryptAlgorithm,
      secrefBuffer,
      Buffer.from(iv, 'base64')
    )
    decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
    return decrypted === secret
  } catch (error) {
    return false
  }
}

export default defineEventHandler(async (event) => {
  let secret = getCookie(event, config.nuxtSecurity.csrf.cookieKey)
  console.log('SECRETffff', secret)

  if (!secret) {
    secret = randomUUID()
    setCookie(
      event,
      config.nuxtSecurity.csrf.cookieKey,
      secret,
      config.nuxtSecurity.csrf.cookieOpts as CookieSerializeOptions
    )
  }

  Object.defineProperty(event.node.res, '_csrftoken', {
    value: createCsrf(secret),
    enumerable: true,
  })

  const method = event.node.req.method ?? ''
  if (!config.nuxtSecurity.csrf.methodsToProtect.includes(method)) {
    return
  }

  console.log('HHHHHHHHHH', event.node.req.url, event.node.req.method)
  // if (event.node.req.method==='GET') return

  if (!event.node.req.url?.includes('api/v1')) return
  const headerCsrf = getHeader(event, 'csrf') ?? ''
  const body = event.node.req.method !== 'GET' ? await readBody(event) : null
  const requestData = body ? body : getQuery(event)
  console.log('DATA', requestData)

  if (!requestData || !Object.keys(requestData).length) return

  if (!verifyCsrf(secret, headerCsrf) || !requestData.nonce || requestData.nonce !== headerCsrf)
    throw createError({
      statusCode: 403,

      name: 'CSRFError',
      statusMessage: 'Bad request',
      data: { code: 'csrf_token_mismatch' },
    })
  const xxsValidator = new FilterXSS(config.nuxtSecurity.xss)
  if (JSON.stringify(requestData) !== xxsValidator.process(JSON.stringify(requestData))) {
    throw createError({
      statusCode: 403,
      name: 'XXSError',
      statusMessage: 'Bad request',
      data: { code: 'xxs_attempt' },
    })
  }
  console.log('ZZZZZZZZZZZZ')
})
