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
import emailTemplateBase from '~/modules/nuxt-mailer/runtime/emailTemplates/base'
import emailTemplateForgotPassword from '~/modules/nuxt-mailer/runtime/emailTemplates/forgot-password'
import { sendMail } from '#mailer'
import errorHandler from '~/utils/errorHandler'

// import { sendMail } from '#mailer'

// import emailTemplateBase from '~/modules/mailer/runtime/email-templates/base'
// import emailTemplatePasswordReset from '~~/modules/mailer/runtime/email-templates/forgot-password'

// import errorHandler from '~/utils/errorHandler'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)
    if (!email) throw new AppError('email is required', 'email_missing', 404)
    const user = await findByEmail(email)
    if (!user) throw new AppError('We cannot find a user with this email in our database', 'user_not_found', 404)
    if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 404)
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.passwordResetExpires = new Date(Date.now() + Number(config.pwResetTokenExpiresIn) * 24 * 60 * 60 * 1000)
    // user.passwordResetExpires = new Date(Date.now() + Number(config.pwResetTokenExpiresIn) * 30 * 1000)
    const updatedUser = await mongoClient
      .db()
      .collection('users')
      .replaceOne({ _id: new ObjectId(user._id) }, user)
    if (!updatedUser) throw new AppError('We cannot update document', 'user_updare_failed', 404)
    const emailBody = emailTemplateForgotPassword(user.name, event.node.req.headers.origin!, resetToken)
    const info = await sendMail(user.email, config.nuxtMailer.forgotPasswordEmailSubject, emailTemplateBase(emailBody))
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }

    // const emailBody = emailTemplatePasswordReset(user.name, event.node.req.headers.origin!, resetToken)
    // const info = await sendMail([user.email], emailTemplateBase(emailBody))
    // if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
    //   return { statusCode: info[0].statusCode }
    // return { statusCode: null }

    // await new sendEmail({
    //   name: user.name as string,
    //   email: user.email as string,
    //   url: event.node.req.headers.origin,
    //   token: resetToken,
    // }).sendPasswordResetEmail()
    // return { userId: user._id }
  } catch (err) {
    return errorHandler(event, err)
  }
})
