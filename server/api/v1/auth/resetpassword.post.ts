import crypto from 'crypto'
import { ObjectId } from 'mongodb'
import AppError from '~/utils/AppError'
import { mongoClient } from '~/utils/mongoClient'
import sendEmail from '~/utils/Email'

// import errorHandler from '~/utils/errorHandler'
import { hashPassword } from '~/server/controllers/v1/auth'

export default defineEventHandler(async (event) => {
  try {
    const { password } = await readBody(event)
    const { passwordResetToken } = getQuery(event)
    console.log('Body "]', password)
    console.log('Query', passwordResetToken)
    // const { password } = body
    const hashedToken = crypto
      .createHash('sha256')
      .update(passwordResetToken as string)
      .digest('hex')
    const user = await mongoClient
      .db()
      .collection('users')
      .findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date(Date.now()) },
        verified: true,
      })
    if (!user) throw new AppError('Invalid password reset token', 'invalid_password_reset_token', 404)
    user.password = await hashPassword(password)
    user.passwordChangeDate = new Date(Date.now())
    delete user.passwordResetToken
    delete user.passwordResetExpires
    const updatedUser = await mongoClient
      .db()
      .collection('users')
      .replaceOne({ _id: new ObjectId(user._id) }, user)
    console.log('USMOD', updatedUser)
    if (!updatedUser)
      throw new AppError('We are not able to reset your password at this time', 'password_reset_failed', 404)
    await new sendEmail({
      name: user.name,
      email: user.email as string,
      url: event.node.req.headers.origin,
      token: '',
    }).sendPasswordResetSuccessEmail()
    return { userId: user._id }
  } catch (err) {
    return errorHandler(event, err)
  }
})
