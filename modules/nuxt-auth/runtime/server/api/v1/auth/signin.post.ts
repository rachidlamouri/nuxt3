import { findByEmail, checkPassword, getSinedJwtToken, setAuthCookie } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { authenticatedDataSchema } from '~/utils/schema'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    // console.log('Here', event.node.req.headers)
    console.log('Bodyfffff', await readBody(event))
    // return await readBody(event)

    const { email, password } = await readBody(event)
    // console.log('??????', config.yrlNuxtAuth.xssValidator)
    return true

    if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
    const user = await findByEmail(email as string)
    if (!user) throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
    if (!(await checkPassword(password, user.password)))
      throw new AppError('Invalid email or password', 'invalid_password', 401)
    if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
    const cookieMaxAge = Number(config.jwtMaxAge) * 1 * 60 * 60
    const authToken = await getSinedJwtToken(user._id, cookieMaxAge)
    setAuthCookie(event, 'authToken', authToken, cookieMaxAge)
    return authenticatedDataSchema.parse({ authToken, cookieMaxAge, ...user })
  } catch (err) {
    return errorHandler(event, err)
  }
})
