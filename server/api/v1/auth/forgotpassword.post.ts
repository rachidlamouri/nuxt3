import crypto from 'crypto'
import sendEmail from '~/utils/Email'
import { mongoClient, ObjectId } from '~/utils/mongoClient'
import {
  findByEmail,
  checkPassword,
  getSinedJwtToken,
  setAuthCookie,
  hasPasswordChanged,
} from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
// import errorHandler from '~/utils/errorHandler'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)
    console.log('Bodyxxxx', email)
    // const { email } = body
    if (!email) throw new AppError('email is required', 'email_missing', 404)
    const user = await findByEmail(email)
    if (!user) throw new AppError('We cannot find a user with this email in our database', 'user_not_found', 404)
    console.log(user)
    if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 404)
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.passwordResetExpires = new Date(Date.now() + Number(config.pwResetTokenExpiresIn) * 24 * 60 * 60 * 1000)
    // user.passwordResetExpires = new Date(Date.now() + Number(config.pwResetTokenExpiresIn) * 30 * 1000)
    const updatedUser = await mongoClient
      .db()
      .collection('users')
      .replaceOne({ _id: new ObjectId(user._id) }, user)
    console.log('US', updatedUser)
    if (!updatedUser) throw new AppError('We cannot update document', 'user_updare_failed', 404)
    await new sendEmail({
      name: user.name as string,
      email: user.email as string,
      url: event.node.req.headers.origin,
      token: resetToken,
    }).sendPasswordResetEmail()
    return { userId: user._id }
  } catch (err) {
    return errorHandler(event, err)
  }
})
