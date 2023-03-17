import { createUser, findByEmail, sendRegistrationVerifyEmail, getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { signupUserSchema } from '~/utils/schema'
import nodemailer from 'nodemailer'
import { sendMail } from '#mailer'
import emailTemplateBase from '~/modules/mailer/runtime/email-templates/base'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { insertedId } = await createUser(body)
    if (!insertedId)
      throw new AppError('Registration failed.  Please try a different email', 'registration_failed', 400)

    const info = await sendMail(
      emailTemplateBase(
        body.name,
        body.email,
        null,
        config.mailer.registrationEmailSubject,
        null,
        'registration',
        event.node.req.headers.origin!,
        await getSinedJwtToken(insertedId, Number(config.jwtSignupTokenMaxAge))
      )
    )

    console.log('Info', info)
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }

    // const transporter = nodemailer.createTransport({
    //   host: 'vps51973.inmotionhosting.com',
    //   port: 465,
    //   secure: true, // use TLS
    //   auth: {
    //     user: config.smtpUser,
    //     pass: config.smtpPass,
    //   },
    // })

    // const info = await transporter.sendMail({
    //   from: 'Care <care@abbaslamouri.com>',
    //   to: ['abbaslamouri@yrlus.com', 'lamouri@genvac.com', 'xyz@genvac.com'],
    //   subject: 'test',
    //   html: ' <h1>Hello</h1>',
    // })

    // console.log('message sent, info', info)
    // if (info.rejected)
    // throw new AppError(`The following emails have been rejected ${info.rejected.join(', ')}`, 'emails_rejected', 400)
    // transporter.verify(function (error, success) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log('Server is ready to take our messages')
    //   }
    // })

    // sendRegistrationVerifyEmail(event.node.req.headers.origin as string, body.name, body.email, insertedId)
    // return { userId: insertedId }
  } catch (err) {
    return errorHandler(event, err)
  }
})

// const hello = useHello()

// import nodemailer from 'nodemailer'
