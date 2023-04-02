import { userRepository } from '~/server/redisSchemas/user'
import jwt, { JwtPayload } from 'jsonwebtoken'
import emailTemplateBase from '~/modules/nuxt-mailer/runtime/emailTemplates/base'
import emailTemplateRegistrationConfirmation from '~/modules/nuxt-mailer/runtime/emailTemplates/registration-confirmation'
import { sendMail } from '#mailer'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { findByIdAndUpdate } from '~/server/controllers/v1/factory'
import { IUser } from '~/utils/schema'
import { createUser, findUserById, findUserByIdAndUpdate } from '#auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = getQuery(event)
    const decoded = jwt.verify(query.signupToken as string, config.jwtSecret, {})
    console.log(decoded)
    if (!decoded || !(decoded as JwtPayload).id)
      throw new AppError('Invalid registration token', 'invalid_signup_token', 404)
    const user = await findUserById(event, (decoded as JwtPayload).id)
    if (!user)
      throw new AppError('We cannot find any records associated with your token', 'user_by_token_not_found', 404)
    if (!('email' in user) || user.email !== body.email)
      throw new AppError(
        'We were not able to vefify your email.  Please try a different email address or contact customer serveice at 555-555-5555',
        'verify_email_not_found',
        404
      )
    const updatedUser = await findUserByIdAndUpdate(event, (decoded as JwtPayload).id, { verified: true })
    if (!updatedUser || !Object.keys(updatedUser) || !Object.keys(updatedUser).length)
      throw new AppError(
        'We were not able to verify your emai.  Please contact customer serveice at 555-555-5555',
        'verify_signup_failed',
        404
      )
    const emailBody = emailTemplateRegistrationConfirmation((updatedUser as IUser).name, event.node.req.headers.origin!)
    const info = await sendMail(body.email, config.nuxtMailer.emailConfirmationSubject, emailTemplateBase(emailBody))
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }
  } catch (err) {
    return errorHandler(event, err)
  }
})
