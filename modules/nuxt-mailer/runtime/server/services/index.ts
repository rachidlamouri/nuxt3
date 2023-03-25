import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'
import AppError from '~/utils/AppError'

const config = useRuntimeConfig()

export const sendMail = async (emailRecipients: string[], html: string) => {
  let info
  if (config.nuxtMailer.mailTransporter === 'nodemailer') {
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
      from: config.nuxtMailer.emailFromEmail,
      to: emailRecipients,
      subject: config.nuxtMailer.contactFormEmailSubject,
      html,
    })
    if (info.rejected)
      throw new AppError(`The following emails have been rejected ${info.rejected.join(', ')}`, 'emails_rejected', 400)
  } else if (config.nuxtMailer.mailTransporter === 'sendgrid') {
    sgMail.setApiKey(config.sendgridApiKey as string)

    const msg = {
      to: emailRecipients,
      from: {
        email: config.nuxtMailer.emailFromEmail,
        name: config.nuxtMailer.emailFromName,
      },
      replyTo: {
        email: config.nuxtMailer.emailFromEmail,
        name: config.nuxtMailer.emailFromName,
      },
      subject: config.nuxtMailer.contactFormEmailSubject,
      // template_id: templateId,
      // dynamic_template_data: { ...this.data, firstname: this.firstname, subject: this.subject },
      // text: ``,
      html,
    }
    info = await sgMail.sendMultiple(msg)
  }
  return info
}
