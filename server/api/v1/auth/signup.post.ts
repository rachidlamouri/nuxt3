import { createUser, getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
// import { sendMail } from '#mailer'
// import emailTemplateBase from '~/modules/mailer/runtime/email-templates/base'
// import emailTemplateRegistration from '~/modules/mailer/runtime/email-templates/registration'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { insertedId } = await createUser(body)
    if (!insertedId)
      throw new AppError('Registration failed.  Please try a different email', 'registration_failed', 400)
    // const emailBody = emailTemplateRegistration(
    //   body.name,
    //   event.node.req.headers.origin!,
    //   await getSinedJwtToken(insertedId, Number(config.jwtSignupTokenMaxAge))
    // )
    // const info = await sendMail([body.email], emailTemplateBase(emailBody))
    // if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
    //   return { statusCode: info[0].statusCode }
    // return { statusCode: null }
  } catch (err) {
    return errorHandler(event, err)
  }
})
