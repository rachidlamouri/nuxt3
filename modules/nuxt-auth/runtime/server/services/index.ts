// import { redis } from '~/utils/redisClient'
// import { userRepository, EntityId } from '~/server/redisSchemas/user'

import { createStorage } from 'unstorage'

import mongodbDriver from 'unstorage/drivers/mongodb'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
// import { ObjectId } from 'mongodb'
// import { H3Event } from 'h3'
import { promisify } from 'util'

// import AppError from '~/utils/AppError'
// import { mongoClient, ObjectId } from '~/utils/mongoClient'
import errorHandler from '~/utils/errorHandler'
import sendEmail from '~/utils/Email'
// import { IUser } from '~/utils/types'

// import { getSinedJwtToken } from '~/server/controllers/v1/factory'
// import { setUserSession } from '#session'
import AppError from '~/utils/AppError'
import { H3Event } from 'h3'
import { Ref, ref } from 'vue'
import memoryDriver from 'unstorage/drivers/memory'
// import redisDriver from 'unstorage/drivers/redis'
import { nanoid } from 'nanoid'

import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'

import { ISession, ISignupUser, IUser } from '~/utils/schema'
// import { findById } from '~/server/controllers/v1/factory'
import { QueryValue } from 'ufo'
// import { ulid } from 'ulid'
// import appRedis from '~/utils/AppRedis'

const config = useRuntimeConfig()
const secrefBuffer = Buffer.from(config.nuxtAuth.encryptSecret)

// const nuxtApp = useNuxtApp()
// console.log(nuxtApp)

const storage = createStorage({
  driver: mongodbDriver({
    connectionString: config.dbUrl,
    databaseName: 'acs',
    collectionName: 'sessions',
  }),
})

// const storage = createStorage({
//   driver: memoryDriver(),
// })

// const storage = createStorage({
//   driver: redisDriver({
//     base: config.nuxtAuth.session.userSessionId,
//     host: config.redisHost,
//     port: Number(config.redisPort),
//     password: config.redisPassword,
//     // tls: true as any,
//   }),
// })

export const createToken = (secret: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(config.nuxtAuth.csrf.encryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

export const createCsrfCookie = async (event: H3Event, secret: string) => {
  let ipAddress = ''
  // const abstractRes: { ip_address: string } = (await $fetch(
  //   `${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`
  // )) || { ip_address: '' }
  // ipAddress = abstractRes.ip_address
  setCookie(event, config.nuxtAuth.csrfCookieName, secret, {
    ...(config.nuxtAuth.cookieOpts as CookieSerializeOptions),
    expires: new Date(Date.now() + config.nuxtAuth.cookieOpts.expiryInSeconds * 1000),
  })

  // const session = {
  //   ipAddress,
  //   secret,
  //   // userId: user[EntityId],
  //   // userName: user.name,
  //   // isAuthenticated,
  // }

  // await storage.setItem(secret, session)
  // return session
}

export const verifyCsrfKey = (secret: string, token: QueryValue) => {
  // console.log('?????', secret, token)
  const [iv, encrypted] = (token as string).split(':')
  if (!iv || !encrypted) {
    return false
  }
  let decrypted
  try {
    const decipher = createDecipheriv(config.nuxtAuth.csrf.encryptAlgorithm, secrefBuffer, Buffer.from(iv, 'base64'))
    decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
    // console.log('!!!!!!!!!', secret, token)

    return decrypted === secret
  } catch (error) {
    return false
  }
}

export const updateUserSession = async (event: H3Event, payload: object) => {
  const userSessionKey = parseCookies(event)[config.nuxtAuth.sessionCookieName]
  if (!(await storage.hasItem(userSessionKey))) return false
  let session = await storage.getItem(userSessionKey)
  // console.log('IIIIII', session, user)
  if (!session) session = {}
  else session = { ...(session as object), ...payload }
  await storage.setItem(userSessionKey, session, { ttl: config.nuxtAuth.cookieOpts.expiryInSeconds })
  return true
  // let ipAddress = ''
  // const abstractRes: { ip_address: string } = (await $fetch(
  //   `${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`
  // )) || { ip_address: '' }
  // ipAddress = abstractRes.ip_address
  // setCookie(event, config.nuxtAuth.sessionCookieName, secret, {
  //   ...(config.nuxtAuth.cookieOpts as CookieSerializeOptions),
  //   expires: new Date(Date.now() + config.nuxtAuth.cookieOpts.expiryInSeconds * 1000),
  // })

  // const session = {
  //   ipAddress,
  //   // userId: user[EntityId],
  //   // userName: user.name,
  //   // isAuthenticated,
  // }

  // await storage.setItem(secret, session, { ttl: config.nuxtAuth.cookieOpts.expiryInSeconds })
}

export const getUserSession = async (event: H3Event) => {
  // let session
  const userSessionKey = parseCookies(event)[config.nuxtAuth.sessionCookieName]
  if (!userSessionKey) return {}
  if (await storage.hasItem(userSessionKey)) return await storage.getItem(userSessionKey)
  return {}
}

export const removeUserSession = async (event: H3Event) => {
  const sessionKey = parseCookies(event)[config.nuxtAuth.sessionCookieName]
  if (!sessionKey) return false
  setCookie(event, config.nuxtAuth.sessionCookieName, sessionKey, {
    expires: new Date(Date.now()),
    secure: config.nuxtAuth.session.cookieSecure,
    httpOnly: config.nuxtAuth.session.cookieHttpOnly,
  })
  if (!(await storage.hasItem(sessionKey))) return false
  await storage.removeItem(sessionKey)
  return true
}

export const hashPassword = async (password: string = '4zE_h2n-mdWaZ9aq&3!G[Y{A,u"_xPvSD"a3q$B') => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password as string, salt)
}

export const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

export const createUser = async (event: H3Event, body: IUser) => {
  return await mongoClient
    .db()
    .collection('users')
    .insertOne({
      name: body.name,
      email: body.email,
      userAddresses: body.userAddresses || [],
      phoneNumber: body.phoneNumber || '',
      media: [],
      role: 'customer',
      password: await hashPassword(body.password),
      active: false,
      verified: false,
      accountNumber: (await mongoClient.db().collection('users').countDocuments()) + 101013,
      signupDate: new Date(Date.now()),
      passwordChangeDate: new Date(Date.now()),
    })
  // try {
  //   // await redis.connect()

  //   // Generate Ulid
  //   // const userUlid = ulid()

  //   // Get document count
  //   // const allDocuments = await redis.ft.search('idx:User', `*`)
  //   // const documentCount = allDocuments && allDocuments.total ? allDocuments.total : 0

  //   // Set new user object
  //   const userObj = {
  //     // id: userUlid,
  //     name: body.name,
  //     email: body.email,
  //     userAddresses: body.userAddresses || [],
  //     phoneNumber: body.phoneNumber || '',
  //     media: [],
  //     role: 'customer',
  //     password: await hashPassword(body.password),
  //     active: false,
  //     verified: false,
  //     // accountNumber: documentCount + 101013,
  //     signupDate: Date.now(),
  //     passwordChangeDate: Date.now(),
  //   }

  //   // Save new user
  //   // const result = await redis.json.set(`User:${userUlid}`, '$', userObj)

  //   // await redis.disconnect()

  //   // Return userId and Token
  //   // if (result && result === 'OK') return await getSinedJwtToken(userUlid, Number(config.jwtSignupTokenMaxAge))
  //   return null
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
}

export const findUserByEmail = async (event: H3Event, email: string) => {
  // throw new AppError('We cannot find a user with this email in our database', 'user_not_found', 404)
  // try {
  // console.log('XXXXXXXX', email)
  return await mongoClient.db().collection('users').findOne({ email })
  // // await appRedis.connect()
  // const results = await appRedis.client.ft.search('idx:User', `@email:{${email.replace(/[.@\\]/g, '\\$&')}}`)
  // // await appRedis.disconnect()
  // console.log(results.total)
  // if (results && results.total > 0) return { id: results.documents[0].id, ...results.documents[0].value }
  // return {}
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
}

export const findUserById = async (event: H3Event, id: string) => {
  return await mongoClient
    .db()
    .collection('users')
    .findOne({ _id: new ObjectId(id) })
  // try {
  //   // await redis.connect()
  //   const results = await redis.ft.search('idx:User', `@id:${id}`)
  //   // await redis.disconnect()
  //   // console.log(results)
  //   if (results && results.total > 0) return { id: results.documents[0].id, ...results.documents[0].value }
  //   return {}
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
}

export const findUserByIdAndUpdate = async (event: H3Event, id: string, payload: object) => {
  if (!id) throw new AppError('id is required', 'user_id_missing', 404)
  // try {
  // let newEntity
  // const found = await findUserById(event, id)
  // console.log('F', found)
  // if (!found || Object.values(found).length == 0)
  //   throw new AppError('We cannot find any records associated with this ID', 'user_by_id_not_found', 404)
  return await mongoClient
    .db()
    .collection('users')
    .replaceOne({ _id: new ObjectId(id) }, { ...(await findUserById(event, id)), ...payload })
  // await redis.connect()
  // const result = await redis.json.set(`User:${id}`, '$', { ...found, ...payload })
  // if (found) newEntity = await repository.save({ ...found, ...payload })
  // await redis.disconnect()
  // return // Return userId and Token
  // if (!verified)
  //   throw new AppError(
  //     'We are not able to update your records,  Please call customer service',
  //     'user_by_id_not_found',
  //     404
  //   )
  // return verified

  // return newEntity as IUser
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
}

export const fetcheSessionUser = async (event: H3Event) => {
  const session = await getUserSession(event)
  // console.log('SSSS', session)
  if (!session || !(session as ISession).userId) return {}
  // const user = await findById(userRepository, (session as ISession).userId)
  // if (user) return user
  return {}
}

export const protect = async (event: H3Event) => {
  // console.log('EEEEEE', event.context.user)
  if (!event.context.user) return false
  return true
  // const session = await getUserSession(event)
  // // console.log('SSSS', session)
  // if (!session || !(session as ISession).userId) return {}
  // const user = await findById(userRepository, (session as ISession).userId)
  // if (user) return user
  // return {}
}

// export const isVerified = async (id: string) => {
//   await redis.connect()
//   const found = await userRepository.fetch(id)
//   console.log('FOUND', found)
//   await redis.disconnect()
//   if (found && found.verified) return true
//   return false
// }

// export const fetchAuthUser = async (event: H3Event) => {
//   // await redis.connect()
//   const { email, password } = await readBody(event)
//   if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
//   const user = await findByEmail(email as string)
//   if (!user) throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
//   // await redis.disconnect()

//   if (!(await checkPassword(password, user.password as string)))
//     throw new AppError('Invalid email or password', 'invalid_password', 401)
//   if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
//   return user

//   // // const cookieMaxAge = Number(config.jwtMaxAge) * 1 * 60 * 60
//   // // const authToken = await getSinedJwtToken(user._id, cookieMaxAge)
//   // // setAuthCookie(event, 'authToken', authToken, cookieMaxAge)
//   // // return authenticatedDataSchema.parse({ authToken, cookieMaxAge, ...user })
//   // // return true
//   // const user = await userRepository.save(userObj)
//   // console.log('E', user[EntityId])
//   // await redis.disconnect()
//   // return { userId: user[EntityId], token: await getSinedJwtToken(user[EntityId], Number(config.jwtSignupTokenMaxAge)) }
// }
