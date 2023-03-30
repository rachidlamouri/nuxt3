import { H3Event } from 'h3'
import redis from '~/utils/redisClient'
import { userRepository, EntityId } from '~~/server/redisSchemas/user'

import { findByEmail, checkPassword, getSinedJwtToken, setAuthCookie } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { authenticatedDataSchema } from '~/utils/schema'
// import { setUserSession } from '#session'
import { fetchAuthUser, setUserSession } from '#auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const user = await fetchAuthUser(event)
    console.log('>>>>>>>>>', user)
    await setUserSession(event, user, true)
    return { userName: user.name, isAuthenticated: true }

    // console.log('OOOOOOO', result)
    // return result
    // const { email, password } = await readBody(event)
    // if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
    // const user = await findByEmail(email as string)
    // if (!user) throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
    // if (!(await checkPassword(password, user.password)))
    //   throw new AppError('Invalid email or password', 'invalid_password', 401)
    // if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
    // return setUserSession(event, user._id.toString())
    // const cookieMaxAge = Number(config.jwtMaxAge) * 1 * 60 * 60
    // const authToken = await getSinedJwtToken(user._id, cookieMaxAge)
    // setAuthCookie(event, 'authToken', authToken, cookieMaxAge)
    // return authenticatedDataSchema.parse({ authToken, cookieMaxAge, ...user })
  } catch (err) {
    return errorHandler(event, err)
  }
})
