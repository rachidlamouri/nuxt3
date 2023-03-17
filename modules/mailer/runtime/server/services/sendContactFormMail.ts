import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import emailTemplateBase from '../../email-templates/base'
import { sendMail } from '#mailer'

export default defineEventHandler(async (event) => {
  try {
    const { name, email, phoneNumber, subject, message } = await readBody(event)
    const info = await sendMail(emailTemplateBase(name, email, phoneNumber, subject, message, 'contact', null, null))
    console.log('Info', info)
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }
  } catch (err) {
    return errorHandler(event, err)
  }
})
