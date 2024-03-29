// import { updateUserSession } from './../../../services/index'
import { H3Event } from 'h3'
import { createUserSession } from '#auth'
// import { redis } from '~/utils/redisClient'
// import { userRepository, EntityId } from '~/server/redisSchemas/user'

// import { findUserByEmail } from '~/server/controllers/v1/factory'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { authenticatedDataSchema } from '~/utils/schema'
// import { setUserSession } from '#session'
import { updateUserSession, checkPassword, findUserByEmail } from '#auth'
import { ISession, ISignupUser, IUser } from '~/utils/schema'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
    const user = await findUserByEmail(event, email as string)
    if (!user || !Object.values(user).length)
      throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
    if (!(await checkPassword(password, user.password as string)))
      throw new AppError('Invalid email or password', 'invalid_password', 401)
    if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
    await createUserSession(event, user)
    // const payload = { userId: user[EntityId], userName: user.name, authenticated: true }

    // await updateUserSession(event, { userId: user[EntityId], userName: user.name, authenticated: true })
    return { userName: user.name, authenticated: true }
  } catch (err) {
    return errorHandler(event, err)
  }
})
