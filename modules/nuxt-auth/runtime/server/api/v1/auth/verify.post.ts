import { ObjectId } from 'mongodb'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { mongoClient } from '~/utils/mongoClient'
import emailTemplateBase from '~/modules/nuxt-mailer/runtime/emailTemplates/base'
import emailTemplateRegistrationConfirmation from '~/modules/nuxt-mailer/runtime/emailTemplates/registration-confirmation'
import { sendMail } from '#mailer'
import { createUser, getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = getQuery(event)
    const decoded = jwt.verify(query.signupToken as string, config.jwtSecret, {})
    const user = await mongoClient
      .db()
      .collection('users')
      .findOne({
        _id: new ObjectId((decoded as JwtPayload).id),
      })
    if (!user) throw new AppError('Invalid registration token', 'invalid_signup_token', 404)
    if (user.email !== body.email)
      throw new AppError(
        'We were not able to vefify your email.  Please try a different email address or contact customer serveice at 555-555-5555',
        'verify_email_not_found',
        404
      )
    const verified = await mongoClient
      .db()
      .collection('users')
      .updateOne(
        {
          _id: new ObjectId(user._id),
        },
        { $set: { verified: true } }
      )

    if (!verified)
      throw new AppError(
        'We were not able to update your records, please contact customer serveice at 555-555-5555',
        'verify_signup_failed',
        404
      )
    const emailBody = emailTemplateRegistrationConfirmation(user.name, event.node.req.headers.origin!)
    const info = await sendMail(body.email, emailTemplateBase(emailBody))
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }
    // return { userId: user._id }
  } catch (err) {
    return errorHandler(event, err)
  }
})
