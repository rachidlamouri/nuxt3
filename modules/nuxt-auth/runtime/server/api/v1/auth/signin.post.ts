// import { updateUserSession } from './../../../services/index'
import { H3Event } from 'h3'
import redis from '~/utils/redisClient'
import { userRepository, EntityId } from '~/server/redisSchemas/user'

import { findByEmail } from '~/server/controllers/v1/factory'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { authenticatedDataSchema } from '~/utils/schema'
// import { setUserSession } from '#session'
import { updateUserSession, checkPassword } from '#auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
    const user = await findByEmail(email as string)
    // console.log('TTTTTTT', user)
    if (!user || !Object.values(user).length)
      throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
    if (!(await checkPassword(password, user.password as string)))
      throw new AppError('Invalid email or password', 'invalid_password', 401)
    if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
    const payload = { userId: user[EntityId], userName: user.name, authenticated: true }
    await updateUserSession(event, payload)
    return payload
  } catch (err) {
    return errorHandler(event, err)
  }
})
