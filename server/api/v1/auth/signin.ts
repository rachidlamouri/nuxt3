import { mongoClient, ObjectId } from '~/utils/mongoClient'
import { setAuthCookie } from '~/server/controllers/v1/auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    // if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
    const user = await mongoClient.db().collection('users').findOne({ email })
    // const user = await findByEmail(email as string)
    // if (!user) throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
    // if( user && await bcrypt.compare(password, user.password))
    // // if (!(await checkPassword(password, user.password)))
    //   throw new AppError('Invalid email or password', 'invalid_password', 401)
    // if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
    const cookieMaxAge = Number(config.jwtMaxAge) * 1 * 60 * 60
    // const authToken = await getSinedJwtToken(user._id, cookieMaxAge)
    setAuthCookie(event, 'authToken', 'hello', { maxAge: cookieMaxAge })
    if (user) return { ...user }
    return 'nothing'
  } catch (err) {
    return err
    // return errorHandler(event, err)
  }
})
