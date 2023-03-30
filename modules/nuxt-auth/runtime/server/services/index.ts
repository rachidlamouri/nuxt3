import redis from '~/utils/redisClient'
import { userRepository, EntityId } from '~/server/redisSchemas/user'

import { createStorage } from 'unstorage'

import mongodbDriver from 'unstorage/drivers/mongodb'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
// import { ObjectId } from 'mongodb'
// import { H3Event } from 'h3'
import { promisify } from 'util'
import { findByEmail } from '~/server/controllers/v1/factory'

// import AppError from '~/utils/AppError'
// import { mongoClient, ObjectId } from '~/utils/mongoClient'
import errorHandler from '~/utils/errorHandler'
import sendEmail from '~/utils/Email'
import { IUser } from '~/utils/types'

import { getSinedJwtToken } from '~/server/controllers/v1/factory'
// import { setUserSession } from '#session'
import AppError from '~/utils/AppError'
import { H3Event } from 'h3'
import { Ref, ref } from 'vue'
import memoryDriver from 'unstorage/drivers/memory'
import redisDriver from 'unstorage/drivers/redis'
import { nanoid } from 'nanoid'

const config = useRuntimeConfig()

// const nuxtApp = useNuxtApp()
// console.log(nuxtApp)

// const storage = createStorage({
//   driver: mongodbDriver({
//     connectionString: useRuntimeConfig().dbUrl,
//     databaseName: 'acs',
//     collectionName: 'sessions',
//   }),
// })

// const storage = createStorage({
//   driver: memoryDriver(),
// })

export const storage = createStorage({
  driver: redisDriver({
    base: config.nuxtAuth.session.userSessionId,
    host: config.redisHost,
    port: Number(config.redisPort),
    password: config.redisPassword,
    // tls: true as any,
  }),
})

export const setUserSession = async (event: H3Event, user, isAuthenticated: boolean) => {
  console.log('????????', user)
  // const abstractRes = (await $fetch(`${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`)) || { ip_address: '' }
  // console.log('IPPPPPPPPPPP', 'abstractRes')
  const sessionKey = nanoid(config.nuxtAuth.session.idLength)

  // const jwtToken = await getSinedJwtToken({ id }, Number(config.jwtSignupTokenMaxAge))
  // console.log('IPPPPPPP', jwtToken)
  // // return jwtToken

  const expirationDate = config.nuxtAuth.session.expiryInSeconds
    ? new Date(Date.now() + config.nuxtAuth.session.expiryInSeconds * 1000)
    : undefined

  // console.log('here')

  setCookie(event, config.nuxtAuth.session.userSessionId, sessionKey, {
    expires: expirationDate,
    secure: config.nuxtAuth.session.cookieSecure,
    httpOnly: config.nuxtAuth.session.cookieHttpOnly,
    // sameSite: config.nuxtAuth.session.cookieSameSite as 'strict',
    // domain: config.nuxtAuth.session.domain,
  })
  // const now = new Date()

  // (Re-)Set cookie
  // const userSessionId = nanoid(config.nuxtAuth.session.idLength)
  // safeSetCookie(event, SESSION_COOKIE_NAME, jwtToken, new Date())

  // console.log('There')

  // Store session data in storage
  const session = {
    userId: user[EntityId],
    userName: user.name,
    isAuthenticated,
    // jwtToken,
    // ip: '989076',
    // ip: '',
    // city: abstractRes.city || '',
  }

  await storage.setItem(sessionKey, session, { ttl: config.nuxtAuth.session.expiryInSeconds })
  // console.log('HAS', await storage.hasItem(SESSION_COOKIE_NAME))
  // console.log('GET', await storage.getItem(SESSION_COOKIE_NAME))

  // event.context.sessionId = jwtToken
  // event.context.session = session

  return session
}

export const getUserSession = async (event: H3Event) => {
  let session
  const userSessionId = parseCookies(event)[config.nuxtAuth.session.userSessionId]
  console.log('User session ID', userSessionId)
  if (!userSessionId) return {}
  console.log('HAS', await storage.hasItem(userSessionId))
  if (await storage.hasItem(userSessionId)) session = await storage.getItem(userSessionId)
  console.log('SSSSSS', session)
  return session
  return {}
}

const hashPassword = async (password: string = '4zE_h2n-mdWaZ9aq&3!G[Y{A,u"_xPvSD"a3q$B') => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password as string, salt)
}

const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

export const createUser = async (payload) => {
  // const createUser = async (payload: Partial<IUser>) => {
  await redis.connect()

  const userObj = {
    name: payload.name,
    email: payload.email,
    userAddresses: payload.userAddresses || [],
    phoneNumber: payload.phoneNumber || '',
    media: [],
    role: 'customer',
    password: await hashPassword(payload.password),
    active: false,
    verified: false,
    accountNumber: (await userRepository.search().return.count()) + 101013,
    // accountNumber: 111,
    signupDate: Date.now(),
    passwordChangeDate: Date.now(),
  }

  const user = await userRepository.save(userObj)
  await redis.disconnect()
  return { userId: user[EntityId], token: await getSinedJwtToken(user[EntityId], Number(config.jwtSignupTokenMaxAge)) }
}

// export const isVerified = async (id: string) => {
//   await redis.connect()
//   const found = await userRepository.fetch(id)
//   console.log('FOUND', found)
//   await redis.disconnect()
//   if (found && found.verified) return true
//   return false
// }

export const fetchAuthUser = async (event: H3Event) => {
  // await redis.connect()
  const { email, password } = await readBody(event)
  if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
  const user = await findByEmail(email as string)
  if (!user) throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
  // await redis.disconnect()

  if (!(await checkPassword(password, user.password as string)))
    throw new AppError('Invalid email or password', 'invalid_password', 401)
  if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
  return user

  // // const cookieMaxAge = Number(config.jwtMaxAge) * 1 * 60 * 60
  // // const authToken = await getSinedJwtToken(user._id, cookieMaxAge)
  // // setAuthCookie(event, 'authToken', authToken, cookieMaxAge)
  // // return authenticatedDataSchema.parse({ authToken, cookieMaxAge, ...user })
  // // return true
  // const user = await userRepository.save(userObj)
  // console.log('E', user[EntityId])
  // await redis.disconnect()
  // return { userId: user[EntityId], token: await getSinedJwtToken(user[EntityId], Number(config.jwtSignupTokenMaxAge)) }
}
