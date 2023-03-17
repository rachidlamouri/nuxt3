import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import emailTemplateBase from '../../email-templates/base'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { name, email, phoneNumber, subject, message } = await readBody(event)
    const toEmails = ['abbaslamouri@yrlus.com']
    let info
    if (config.mailer.mailTransporter === 'nodemailer') {
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort),
        secure: Boolean(true), // use TLS
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
      })

      info = await transporter.sendMail({
        from: 'Care <care@abbaslamouri.com>',
        to: 'lamouri@genvac.com',
        subject: 'New message from yrl-consulting.com site',
        html: ' <h1>Hello</h1>',
      })
      if (info.rejected)
        throw new AppError(
          `The following emails have been rejected ${info.rejected.join(', ')}`,
          'emails_rejected',
          400
        )
    } else if (config.mailer.mailTransporter === 'sendgrid') {
      sgMail.setApiKey(config.sendgridApiKey as string)

      const msg = {
        to: toEmails,

        from: {
          email: config.public.fromEmail,
          name: config.public.fromName,
        },
        replyTo: {
          email: config.public.fromEmail,
          name: config.public.fromName,
        },
        subject: 'New message from yrl-consulting.com site',
        // template_id: templateId,
        // dynamic_template_data: { ...this.data, firstname: this.firstname, subject: this.subject },
        // text: ``,
        html: emailTemplateBase(name, email, phoneNumber, subject, message),
      }
      info = await sgMail.sendMultiple(msg)
    }
    return info
  } catch (err) {
    return errorHandler(event, err)
  }
})
