import redis from '~/utils/redisClient'
import { userRepository, EntityId } from '~/server/redisSchemas/user'

import AppError from '~/utils/AppError'
import { H3Event } from 'h3'
import { Ref, ref } from 'vue'
import { createStorage } from 'unstorage'

import memoryDriver from 'unstorage/drivers/memory'
import mongodbDriver from 'unstorage/drivers/mongodb'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
// import { ObjectId } from 'mongodb'
// import { H3Event } from 'h3'
import { promisify } from 'util'
import { findById } from '~/server/controllers/v1/factory'

// import AppError from '~/utils/AppError'
// import { mongoClient, ObjectId } from '~/utils/mongoClient'
import errorHandler from '~/utils/errorHandler'
import sendEmail from '~/utils/Email'
import { IUser } from '~/utils/types'

// import { getSinedJwtToken, hashPassword } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()

const hashPassword = async (password: string = '4zE_h2n-mdWaZ9aq&3!G[Y{A,u"_xPvSD"a3q$B') => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password as string, salt)
}

const getSinedJwtToken = async function (id: any, maxAge: number) {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: maxAge })
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
    // accountNumber: (await mongoClient.db().collection('users').countDocuments()) + 101013,
    accountNumber: 111,
    signupDate: Date.now(),
    passwordChangeDate: Date.now(),
  }

  // return true
  const user = await userRepository.save(userObj)
  console.log('E', user[EntityId])
  await redis.disconnect()

  return { userId: user[EntityId], token: await getSinedJwtToken(user[EntityId], Number(config.jwtSignupTokenMaxAge)) }
  // return await mongoClient
  //   .db()
  //   .collection('users')
  //   .insertOne({
  //     name: payload.name,
  //     email: payload.email,
  //     userAddresses: payload.userAddresses || [],
  //     phoneNumber: payload.phoneNumber || '',
  //     media: [],
  //     role: 'customer',
  //     password: await hashPassword(payload.password),
  //     active: false,
  //     verified: false,
  //     accountNumber: (await mongoClient.db().collection('users').countDocuments()) + 101013,
  //     signupDate: new Date(Date.now()),
  //     passwordChangeDate: new Date(Date.now()),
  //   })
  // }
}
