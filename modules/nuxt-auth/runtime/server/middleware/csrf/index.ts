import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { FilterXSS } from 'xss'

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

export default defineEventHandler(async (event) => {
  // // try {
  // // if (process.server) console.log('MIddleware', event.node.req.method)
  // let secret = getCookie(event, config.yrlNuxtAuth.csrfCookieKey)
  // // console.log('SECRET', secret)
  // if (!secret) {
  //   secret = randomUUID()
  //   setCookie(event, config.yrlNuxtAuth.csrfCookieKey, secret, config.yrlNuxtAuth.csrfCookieOpts)
  // }
  // Object.defineProperty(event.node.res, '_csrftoken', {
  //   value: createCsrf(secret),
  //   enumerable: true,
  // })
  // // useNuxtApp().payload.csrfToken = '1234'
  // // console.log('!!!!!!!!!!!!', useNuxtApp().payload.csrfToken)
  // // console.log('Header', getHeader(event, 'csrf-token'))
  // if (getHeader(event, 'csrf-token')) console.log('MIddleware end', verifyCsrf(secret, getHeader(event, 'csrf-token')))
  // const method = event.node.req.method ?? ''
  // if (!config.yrlNuxtAuth.methodsToProtect.includes(method)) {
  //   return
  // }
  // const url = event.node.req.url ?? ''
  // const excluded =
  //   config.yrlNuxtAuth.excludedUrls?.filter((el) => (Array.isArray(el) ? new RegExp(...el).test(url) : el === url))
  //     .length > 0
  // const token = getHeader(event, 'csrf-token') ?? ''
  // if (!excluded && !verifyCsrf(secret, token)) {
  //   throw createError({
  //     statusCode: 403,
  //     name: 'CSRFError',
  //     statusMessage: 'CSRF Token Mismatch',
  //     data: { ss: 'jdjdsjdsfjjkdkjfskjsdf' },
  //   })
  // }
  // if (!['POST', 'GET', 'PATCH', 'DELETE'].includes(event.node.req.method!!)) return
  // const xxsValidator = new FilterXSS(config.yrlNuxtAuth.xssValidator)
  // const requestData = event.node.req.method === 'GET' ? getQuery(event) : await readBody(event)
  // if (!requestData || !Object.keys(requestData).length) return
  // if (JSON.stringify(requestData) !== xxsValidator.process(JSON.stringify(requestData))) {
  //   throw createError({
  //     statusCode: 403,
  //     name: 'XXSError',
  //     statusMessage: 'Bad request',
  //     data: { ss: 'jdjdsjdsfjjkdkjfskjsdf' },
  //   })
  // }
})
