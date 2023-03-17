import { createUser, findByEmail, sendRegistrationVerifyEmail } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { signupUserSchema } from '~/utils/schema'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { insertedId } = await createUser(body)

    const transporter = nodemailer.createTransport({
      host: 'vps51973.inmotionhosting.com',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: 'care@abbaslamouri.com',
        pass: 'R9_^Z~Oiesi1',
      },
    })

    const info = await transporter.sendMail({
      from: 'Care <care@abbaslamouri.com>',
      to: 'abbaslamouri@yrlus.com',
      subject: 'test',
      html: ' <h1>Hello</h1>',
    })

    console.log('message sent, info', info)
    // transporter.verify(function (error, success) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log('Server is ready to take our messages')
    //   }
    // })

    // sendRegistrationVerifyEmail(event.node.req.headers.origin as string, body.name, body.email, insertedId)
    return { userId: insertedId }
  } catch (err) {
    return errorHandler(event, err)
  }
})

// const hello = useHello()

// import nodemailer from 'nodemailer'
