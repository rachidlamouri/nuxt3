import errorHandler from '~/utils/errorHandler'
import emailTemplateBase from '../modules/nuxt-mailer/runtime/emailTemplates/base'
import emailTemplateContact from '../modules/nuxt-mailer/runtime/emailTemplates/contact'
import { sendMail } from '#mailer'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { name, email, phoneNumber, subject, message } = await readBody(event)
    const emailBody = emailTemplateContact(name, email, phoneNumber, subject, message)
    const info = await sendMail(
      config.mailer.emailRecipients.filter((r: string) => r),
      emailTemplateBase(emailBody)
    )
    console.log('Info', info)
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }
  } catch (err) {
    return errorHandler(event, err)
  }
})
